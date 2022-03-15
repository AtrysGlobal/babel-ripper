export abstract class BabelHandler {
  public static fromAxios(exception: any) {
    if (exception.response) {
      throw new Error(
        `Exception received from remote BABEL API - (status code ${
          exception.response.status
        } ${exception.response.statusText}) - ${JSON.stringify(
          exception.response.data,
        )} `,
      );
    } else if (exception.request) {
      // The request was made but no response was received
      throw new Error(
        `Connection couldn't be stablished with remote BABEL API. ` +
          `Please check your internet connection, proxy configuration or BABEL service status `,
      );
    }
  }
}
