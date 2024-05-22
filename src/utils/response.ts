import { questionTypes } from "@/constants/questionTypes";
import { getCloseEndedTypes } from "@/lib/prisma/closeEndedChoiceType";
import {
  getCloseEndedStats,
  getMultiSelectMCQStats,
  getMultipleChoiceStats,
  getOpenEndedStats,
} from "@/lib/prisma/response";
import { encodeID } from "./crypto";

export async function getSurveyStats(surveyId: string) {
  const [
    multipleChoice,
    closeEnded,
    openEnded,
    closeEndedTypes,
    multiSelectMcqs,
  ] = await Promise.all([
    getMultipleChoiceStats(surveyId),
    getCloseEndedStats(surveyId),
    getOpenEndedStats(surveyId),
    getCloseEndedTypes(),
    getMultiSelectMCQStats(surveyId),
  ]);

  const openEndedStats = serialiseOpenEnded(openEnded as any[]);
  const closeEndedStats = serializeCloseEnded(
    closeEnded as any[],
    closeEndedTypes
  );
  const multipleChoiceStats = serializeMcqs(multipleChoice as any[]);

  const multiSelectStats = serializeMultiSelectMcqs(multiSelectMcqs);

  return {
    openEndedStats,
    closeEndedStats,
    multipleChoiceStats,
    multiSelectStats,
  };
}

function serializeMultiSelectMcqs(stats: any[]) {
  return stats.map((question) => {
    const { Choice, question_text, question_type, id, orderNumber } = question;

    const data = { question_text, question_type, id,orderNumber };

    const options = Choice.map((c: any) => {
      const {
        choice_text: choiceText,
        _count: { ChoiceResponse: choiceCount },
      } = c;

      return {
        choiceCount,
        choiceText,
      };
    });

    Object.assign(data, { options });

    return data;
  });
}

function serializeMcqs(multipleChoice: any[]) {
  const mcqsDict = new Map();

  //   serialize mcqs
  multipleChoice.forEach((mcq) => {
    if (mcqsDict.has(mcq.id)) {
      mcqsDict.get(mcq.id).options.push({
        choiceCount: +mcq.choiceCount.toString(),
        choiceText: mcq.choice_text,
      });
    } else {
      mcqsDict.set(mcq.id, {
        id: mcq.id,
        question_text: mcq.question_text,
        question_type: questionTypes.mcqs,
        options: [
          {
            choiceCount: +mcq.choiceCount.toString(),
            choiceText: mcq.choice_text,
          },
        ],
      });
    }
  });

  return Array.from(mcqsDict.values());
}

function serialiseOpenEnded(openEnded: any[]) {
  const openEndedDict = new Map();
  //   serialize open ended
  openEnded.forEach((res) => {
    if (openEndedDict.has(res.id)) {
      openEndedDict.get(res.id).options.push(res.response_text);
    } else {
      openEndedDict.set(res.id, {
        question_text: res.question_text,
        question_type: questionTypes.openEnded,
        id: res.id,
        options: [res.response_text],
      });
    }
  });
  return Array.from(openEndedDict.values());
}

function serializeCloseEnded(closeEnded: any[], closeEndedTypes: any[]) {
  const typeDict = new Map();
  const choceGroupDict = new Map();

  closeEndedTypes.forEach((ct) => {
    // create map for each option list
    const typeList = ct.CloseEndedChoice.map((t: any) => [
      t.id,
      { choice_text: t.choice_text, count: 0 },
    ]);

    // add that map to dict for quic access
    choceGroupDict.set(ct.id, new Map([...typeList] as any));
    // adding option to dict to get type (to get full types group)
    ct.CloseEndedChoice.map((t: any) => {
      typeDict.set(t.id, t.type_id);
    });
  });

  const closeEndedDict = new Map();

  closeEnded.forEach((ce: any) => {
    if (closeEndedDict.has(ce.id)) {
      const response = closeEndedDict.get(ce.id);
      response.options.get(ce.closeEnededChoice_id).count =
        +ce.choiceCount.toString();
    } else {
      const type = typeDict.get(ce.closeEnededChoice_id);
      const emptyGroup = choceGroupDict.get(type);

      const responce = {
        id: ce.id,
        question_text: ce.question_text,
        question_type: questionTypes.closeEnded,
        options: deepCopyMap(emptyGroup),
      };
      responce.options.get(ce.closeEnededChoice_id).count =
        +ce.choiceCount.toString();
      closeEndedDict.set(ce.id, responce);
    }
  });
  return Array.from(closeEndedDict.values()).map((v) => ({
    ...v,
    options: Array.from(v.options.values()),
  }));
}

function deepCopyMap(originalMap: any) {
  const newMap = new Map();

  for (const [key, value] of originalMap.entries()) {
    // If the value is an object or Map, recursively deep copy it
    const copiedValue =
      value instanceof Map
        ? deepCopyMap(value)
        : typeof value === "object" && value !== null
        ? { ...value }
        : value;

    newMap.set(key, copiedValue);
  }

  return newMap;
}

export function getResponseAnswer(response: any, type: string) {
  let defaultResponse = "";

  if (type === questionTypes.openEnded) {
    defaultResponse = response?.response_text;
  } else if (type === questionTypes.closeEnded) {
    defaultResponse =
      response?.closeEnededChoice_id && encodeID(response.closeEnededChoice_id);
  } else if (type === questionTypes.mcqs) {
    defaultResponse = response?.choice_id && encodeID(response.choice_id);
  } else if (type === questionTypes.multiSelectMcq) {
    defaultResponse = response.ChoiceResponse.map((r: any) =>
      encodeID(r.choiceId)
    );
  }

  return defaultResponse;
}
