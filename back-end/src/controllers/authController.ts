import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models";

function publicUser(user: any) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    biotype: user.biotype,
  };
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Nome, e-mail e senha são obrigatórios." });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ success: false, message: "E-mail já cadastrado." });

    const hash = await bcrypt.hash(password, 8);
    const user = await User.create({ name, email, phone, password: hash, role: role || "student" });
    return res.status(201).json({ success: true, message: "Cadastro realizado com sucesso.", user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Erro ao cadastrar usuário." });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: "E-mail ou senha inválidos." });

    const ok = await bcrypt.compare(password, (user as any).password);
    if (!ok) return res.status(401).json({ success: false, message: "E-mail ou senha inválidos." });

    const token = jwt.sign(publicUser(user), process.env.JWT_SECRET || "alphafit_dev_secret", { expiresIn: "8h" });
    return res.json({ success: true, message: "Login realizado com sucesso.", token, user: publicUser(user) });
  } catch {
    return res.status(500).json({ success: false, message: "Erro ao realizar login." });
  }
}

export async function listUsers(_req: Request, res: Response) {
  const users = await User.findAll({ attributes: ["id", "name", "email", "phone", "role", "biotype", "createdAt"] });
  return res.json({ success: true, users });
}

export async function createUser(req: Request, res: Response) {
  const { name, email, phone, password, role } = req.body;
  const hash = await bcrypt.hash(password || "123456", 8);
  const user = await User.create({ name, email, phone, password: hash, role: role || "student" });
  return res.status(201).json({ success: true, message: "Usuário criado.", user: publicUser(user) });
}

export async function updateUser(req: Request, res: Response) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado." });
  await user.update(req.body);
  return res.json({ success: true, message: "Usuário atualizado.", user: publicUser(user) });
}

export async function deleteUser(req: Request, res: Response) {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "Usuário não encontrado." });
  await user.destroy();
  return res.json({ success: true, message: "Usuário removido." });
}
