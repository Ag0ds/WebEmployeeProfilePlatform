import { areasRepository } from "./repository";

export const areasService = {
  list: () => areasRepository.listAll(),
};
