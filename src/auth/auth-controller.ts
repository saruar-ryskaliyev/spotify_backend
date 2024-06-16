import { Request, Response } from 'express';
import { CreateUserDto } from './dtos/CreateUser.dto';
import AuthService from './auth-service';

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Request Body:', req.body); // Log the request body
      const createUserDto: CreateUserDto = req.body;
      const user = await this.authService.registerUser(createUserDto);
      res.status(201).json(user);
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'Error registering user' });
    }
  }

  loginUser = async (req: Request, res: Response): Promise<void> => {

    console.log(req.body)


    try {
      const { email, password } = req.body;
      const result = await this.authService.loginUser(email, password);
      if (!result) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      console.error('Error in AuthController loginUser:', err);
      res.status(500).json({ message: 'Error logging in' });
    }
  }

  searchUsers = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.params;
    try {
      console.log("Received search request with query:", query);
      const users = await this.authService.searchUsers(query || '');
      console.log("Search results:", users);
      res.status(200).json(users);
    } catch (error) {
      console.error('Error in AuthController searchUsers:', error);
      res.status(500).json({ message: 'Error searching users', error });
    }
  }

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Refresh Token Request Body:', req.body); // Log the request body
      const { token } = req.body;
      const result = await this.authService.refreshToken(token);
      if (!result) {
        res.status(401).json({ message: 'Invalid or expired refresh token' });
        return;
      }
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: 'Error refreshing token' });
    }
  }


  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    const { user } = req as any;
    res.status(200).json(user);
  }
}

export default AuthController;
