import { Op } from 'sequelize';
import Contact from '../models/contact.model';

export const getExistingContact = async (
    phoneNumber: string,
    email: string
) => {
    const existingContact = await Contact.findAll({
        where: {
            [Op.or]: [{ phoneNumber }, { email }]
        },
        order: [['createdAt', 'ASC']]
    });
    return existingContact;
};

export const consolidatedContacts = (contacts: Contact[]) => {
    const emails = contacts
        .filter((contact) => contact.email)
        .map((contact) => contact.email)
        .filter(
            (value, index, current_value) =>
                current_value.indexOf(value) === index
        );
    const phoneNumbers = contacts
        .filter((contact) => contact.phoneNumber)
        .map((contact) => contact.phoneNumber)
        .filter(
            (value, index, current_value) =>
                current_value.indexOf(value) === index
        );
    const secondaryContactIds = contacts
        .filter((contact) => contact.linkPrecedence === 'secondary')
        .map((contact) => contact.linkedId);

    return {
        primaryContatctId: contacts.length > 0 ? contacts[0].id : null,
        emails,
        phoneNumbers,
        secondaryContactIds
    };
};

export const getAllLinkedContacts = async (contactId: number) => {
    const linkedContacts = await Contact.findAll({
        where: {
            [Op.or]: [{ id: contactId }, { linkedId: contactId }]
        },
        order: [['createdAt', 'ASC']]
    });
    return linkedContacts;
};
