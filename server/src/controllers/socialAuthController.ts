// import { NextFunction, Request,Response } from "express";
// import { BadRequestError } from "src/errors/errorClasses";
// import { User } from "src/models/User";
// import { SocialAuthService } from "src/services/SocialAuthService";
// import { getGoogleAuthURL } from "src/utils/googleAuth";

// const authService = new SocialAuthService();

// export class SocialAuthController {

//   async googleLogin(req: Request, res: Response,next:NextFunction) {
//     try {
//       const state = Math.random().toString(36).substring(2, 15);
//       const authUrl = getGoogleAuthURL(state);

//       res.json({
//         success: true,
//         authUrl,
//         state,
//       });
//     } catch (error) {
//       next(error)

//     }
// }

//   async googleCallback(req: Request, res: Response,next:NextFunction) {
//     try {
//       const { code, error, error_description } = req.query;

//       if (error) {
//         throw new BadRequestError(error_description?.toString() || 'Google authentication failed')
//       }

//       if (!code) {
//         throw new BadRequestError( 'Authorization code not provided')
//       }

//       const result:User = await authService.googleAuth(code as string);

//       res.status(200).json({
//         success: true,
//         message: 'Google authentication successful',
//         data: result,
//       });
//     } catch (error: any) {
//      next(error)
//     }
//   }

// }
