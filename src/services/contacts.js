// backend/src/services/contacts.js

/**
 * Returns all contacts for a given user.
 */
async function listContacts(prisma, userId) {
    return prisma.contact.findMany({
      where: { userId },
      select: { id: true, name: true, email: true, phone: true },
      orderBy: { createdAt: 'desc' },
    });
  }
  
  /**
   * Creates a new contact for a given user.
   */
  async function addContact(prisma, userId, { name, email, phone }) {
    return prisma.contact.create({
      data: { userId, name, email, phone },
    });
  }
  
  module.exports = {
    listContacts,
    addContact,
  };
  