import { emails } from "../data/emails";

export const emailService = {
  emails,
  async getEmails() {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return this.emails;
  },
};
