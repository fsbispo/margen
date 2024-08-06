export enum ExamType {
    EXAME_CLINICO = 1,
    EXAME_SIMPLES = 2,
    COMPLEMENTARES = 3,
}

export const ExamText = {
  [ExamType.EXAME_CLINICO]: "Clínico",
  [ExamType.EXAME_SIMPLES]: "Simples",
  [ExamType.COMPLEMENTARES]: "Complementar",
};