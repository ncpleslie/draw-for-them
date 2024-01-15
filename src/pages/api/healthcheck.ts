import type { NextApiRequest, NextApiResponse } from "next";

/**
 * The response data for the healthcheck endpoint.
 */
type ResponseData = {
  /**
   * The status of the application.
   */
  status: "OK";
};

/**
 * A healthcheck endpoint for the application.
 * @param req - The request object.
 * @param res - The response object containing the status.
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // TODO: Add further checks to ensure the application is healthy.
  res.status(200).json({ status: "OK" });
}
