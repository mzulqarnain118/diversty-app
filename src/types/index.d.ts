export type ISurvey = {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  isTemplate: boolean;
  isArchived: boolean;
  userId: string;
};

export type IQuestion = {
  id: number;
  survey_id: any;
  question_type: string;
  question_text: string;
  type: "QUESTION";
  closeEndedChoiceType_id?: string;
  Choice: { choice_text: string; id: string }[];
  isTemplate: boolean;
  orderNumber: number;
  tags: ITag[],
  total?: number,
  position?: number
};

export type ISection = {
  id: number;
  createdAt: Date;
  title: "SECTION";
  type: string;
  description: string;
  survey_id: string;
  orderNumber: number;
  total?: number,
  position?: number
};


export type ITag = {
  id: string;
  title: string;
  description: string;
}