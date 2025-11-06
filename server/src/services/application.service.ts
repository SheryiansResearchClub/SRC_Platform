import { InternalServerError } from "@/utils/errors";
import { applicationRepo } from "../repositories/application.respository";

class ApplicationService {
  async createApplication(applicationData: any) {
    try {
      const application = await applicationRepo.create(applicationData);
      return application;
    } catch (error) {
      throw new InternalServerError("Application Not Created");
    }
  }

  async getAllApplications(
    filter: any,
    options: any
  ) {
    try {
      return applicationRepo.get(filter, options);
    } catch (error) {
      throw new InternalServerError("Applications Not Found");
    }
  }
}

export const applicationService = new ApplicationService();