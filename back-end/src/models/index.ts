export { User } from "./User";
export { ChatMessage } from "./ChatMessage";
export { Exercise } from "./Exercise";
export { WorkoutPlan } from "./WorkoutPlan";

export { StudentProfile } from "./StudentProfile";
export { StudentDietPlan } from "./StudentDietPlan";
export { StudentDietMeal } from "./StudentDietMeal";
export { StudentWorkoutSheet } from "./StudentWorkoutSheet";
export { StudentWorkoutItem } from "./StudentWorkoutItem";
export { StudentCheckIn } from "./StudentCheckIn";
export { ScheduleEvent } from "./ScheduleEvent";

import { User } from "./User";
import { StudentProfile } from "./StudentProfile";
import { StudentDietPlan } from "./StudentDietPlan";
import { StudentDietMeal } from "./StudentDietMeal";
import { StudentWorkoutSheet } from "./StudentWorkoutSheet";
import { StudentWorkoutItem } from "./StudentWorkoutItem";
import { StudentCheckIn } from "./StudentCheckIn";
import { ScheduleEvent } from "./ScheduleEvent";

User.hasOne(StudentProfile, { foreignKey: "userId", as: "profile" });
StudentProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasOne(StudentDietPlan, { foreignKey: "userId", as: "dietPlan" });
StudentDietPlan.belongsTo(User, { foreignKey: "userId", as: "user" });

StudentDietPlan.hasMany(StudentDietMeal, { foreignKey: "dietPlanId", as: "meals" });
StudentDietMeal.belongsTo(StudentDietPlan, { foreignKey: "dietPlanId", as: "dietPlan" });

User.hasOne(StudentWorkoutSheet, { foreignKey: "userId", as: "workoutSheet" });
StudentWorkoutSheet.belongsTo(User, { foreignKey: "userId", as: "user" });

StudentWorkoutSheet.hasMany(StudentWorkoutItem, { foreignKey: "sheetId", as: "items" });
StudentWorkoutItem.belongsTo(StudentWorkoutSheet, { foreignKey: "sheetId", as: "sheet" });

User.hasMany(StudentCheckIn, { foreignKey: "userId", as: "checkins" });
StudentCheckIn.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(ScheduleEvent, { foreignKey: "userId", as: "scheduleEvents" });
ScheduleEvent.belongsTo(User, { foreignKey: "userId", as: "user" });