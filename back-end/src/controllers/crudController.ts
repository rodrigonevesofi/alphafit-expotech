import { Request, Response } from "express";
import { Exercise, WorkoutPlan } from "../models";

function crud(model: any, label: string) {
  return {
    async list(_req: Request, res: Response) {
      const data = await model.findAll({ order: [["id", "DESC"]] });
      return res.json({ success: true, data });
    },
    async create(req: Request, res: Response) {
      const data = await model.create(req.body);
      return res.status(201).json({ success: true, message: `${label} criado.`, data });
    },
    async update(req: Request, res: Response) {
      const item = await model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: `${label} não encontrado.` });
      await item.update(req.body);
      return res.json({ success: true, message: `${label} atualizado.`, data: item });
    },
    async remove(req: Request, res: Response) {
      const item = await model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: `${label} não encontrado.` });
      await item.destroy();
      return res.json({ success: true, message: `${label} removido.` });
    },
  };
}

export const exerciseController = crud(Exercise, "Exercício");
export const workoutPlanController = crud(WorkoutPlan, "Plano");
