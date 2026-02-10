import { Request, Response } from "express";
import { AppDataSource } from "../config/db";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    console.log("Tentative de connexion:", username);

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: "Username et password requis" 
      });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { username } });

    if (!user) {
      console.log("Utilisateur non trouvé:", username);
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    console.log("Utilisateur trouvé:", user.username);

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("Mot de passe incorrect");
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    console.log("Authentification réussie");

    const token = generateToken(user.id, user.role);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ 
      message: "Erreur serveur",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};