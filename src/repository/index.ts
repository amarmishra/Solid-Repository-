import { AppDataSource } from "../connect-db";
import Contact from "../models/contact";

export const contactRepo=AppDataSource.getRepository(Contact)