export abstract class BabelHandler {
  public static fromAxios(exception: any) {
    if (exception.response) {
      // Request made and server responded
      console.log(exception.response.data);
      console.log(exception.response.status);
      console.log(exception.response.headers);

      throw new Error(
        `Exception received from remote BABEL API - (status code ${exception.response.status}) - ${exception.response.data} `,
      );
    } else if (exception.request) {
      // The request was made but no response was received
      console.log(exception.request);
      throw new Error(
        `Lib couldn't stablish connection with remote BABEL API REST. Please check your internet connection or proxy configuration.`,
      );
    }
  }
}
