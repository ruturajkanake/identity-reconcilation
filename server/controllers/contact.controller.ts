import Contact from '../models/contact.model';
import { BAD_REQUEST, INTERNAL_ERROR } from '../helpers/response.helper';
import { CREATE } from '../helpers/response.helper';
import { Request, Response } from 'express';
import {
    getExistingContact,
    consolidatedContacts,
    getAllLinkedContacts
} from '../helpers/contact.helper';
import validator from 'validator';
import { Op } from 'sequelize';

export const createContact = async (req: Request, res: Response) => {
    try {
        let phoneNumber = req.body.phoneNumber;
        let email = req.body.email;

        if (!phoneNumber && !email) {
            return BAD_REQUEST(
                res,
                'Please provide either a phone number or email'
            );
        }

        if (email && !validator.isEmail(email)) {
            return BAD_REQUEST(res, 'Please provide a valid email');
        }
        if (phoneNumber && !validator.isMobilePhone(phoneNumber)) {
            return BAD_REQUEST(res, 'Please provide a valid phone number');
        }

        if (email === null || email === undefined) {
            email = null;
        }
        if (phoneNumber === null || phoneNumber === undefined) {
            phoneNumber = null;
        }

        let result;

        const existingContact = await getExistingContact(phoneNumber, email);
        if (existingContact.length === 0) {
            // No existing contact. Create a new contact
            await Contact.create({
                phoneNumber,
                email,
                linkPrecedence: 'primary'
            });
            result = consolidatedContacts(existingContact);
        } else if (existingContact.length === 1) {
            // One existing contact. Link the new contact to the existing contact
            const primaryContactId =
                existingContact[0].linkPrecedence === 'primary'
                    ? existingContact[0].id
                    : existingContact[0].linkedId;
            const linkedContacts = await getAllLinkedContacts(primaryContactId);
            result = consolidatedContacts(linkedContacts);
            if (
                existingContact[0].phoneNumber !== phoneNumber ||
                existingContact[0].email !== email
            ) {
                // If there is no duplicate contact, create a new contact
                await Contact.create({
                    phoneNumber,
                    email,
                    linkedId: primaryContactId,
                    linkPrecedence: 'secondary'
                });
            }
        } else {
            const duplicateContacts = existingContact.filter(
                (contact) =>
                    contact.phoneNumber === phoneNumber &&
                    contact.email === email
            );
            if (duplicateContacts.length > 0) {
                const primaryContactId =
                    duplicateContacts[0].linkPrecedence === 'primary'
                        ? duplicateContacts[0].id
                        : duplicateContacts[0].linkedId;
                const linkedContacts = await getAllLinkedContacts(
                    primaryContactId
                );
                result = consolidatedContacts(linkedContacts);
            } else {
                // Multiple existing contacts. Link the new contact to the primary contact
                const primaryContacts = existingContact.filter(
                    (contact) => contact.linkPrecedence === 'primary'
                );
                const primaryContactId = primaryContacts[0].id;
                const otherPrimaryContacts = primaryContacts.slice(1);
                const otherPrimaryContactIds = otherPrimaryContacts.map(
                    (contact) => contact.id
                );
                if (otherPrimaryContacts.length > 0) {
                    // If there are multiple primary contacts, link them to the first primary contact
                    for (let i = 0; i < otherPrimaryContacts.length; i++) {
                        otherPrimaryContacts[i].linkedId = primaryContactId;
                        otherPrimaryContacts[i].linkPrecedence = 'secondary';
                        await otherPrimaryContacts[i].save();
                    }
                    // Update secondary contacts to link to the first primary contact
                    await Contact.update(
                        {
                            linkedId: primaryContactId
                        },
                        {
                            where: {
                                linkedId: {
                                    [Op.in]: otherPrimaryContactIds
                                }
                            }
                        }
                    );
                    const updatedSecondaryContacts = await Contact.findAll({
                        where: {
                            linkedId: {
                                [Op.in]: otherPrimaryContactIds
                            }
                        }
                    });
                    // Create a new contact
                    await Contact.create({
                        phoneNumber,
                        email,
                        linkedId: primaryContactId,
                        linkPrecedence: 'secondary'
                    });

                    // Consolidate all linked contacts
                    result = consolidatedContacts([
                        ...primaryContacts,
                        ...updatedSecondaryContacts
                    ]);
                } else {
                    // If there is only one primary contact, link the new contact to the primary contact
                    await Contact.create({
                        phoneNumber,
                        email,
                        linkedId: primaryContactId,
                        linkPrecedence: 'secondary'
                    });
                    const linkedContacts = await getAllLinkedContacts(
                        primaryContactId
                    );
                    result = consolidatedContacts(linkedContacts);
                }
            }
        }

        CREATE(res, { contact: result });
    } catch (err) {
        INTERNAL_ERROR(res, err);
    }
};
