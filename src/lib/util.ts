import { ActionSubject } from '@/types/action-subject.type';

export const enumToFilteredArray = <T extends Record<string, string | number>>(
  enumObj: T,
  omitValues: (string | number)[]
): (string | number)[] => {
  return Object.values(enumObj).filter((value) => !omitValues.includes(value));
};

export const enumToArray = <T extends Record<string, string | number>>(
  enumObj: T
): (string | number)[] => {
  return Object.values(enumObj);
};

/**
 * Utility function to map an action enum and a subject enum to an array of ActionSubject objects.
 * @param actionEnum - The enum object with actions.
 * @param subjectEnum - The enum object with subjects.
 * @returns An array of ActionSubject objects.
 */
export const mapEnumToObjects = (
  actionEnum: Record<string, string>,
  subjectEnum: Record<string, string>
): ActionSubject[] => {
  // Extract the subject value. In this case, we assume there's only one subject value.
  const subject = Object.values(subjectEnum)[0];

  return Object.values(actionEnum).map((action) => ({
    action,
    subject,
  }));
};

/**
 * Utility function to map specified enum members to an array of objects.
 * @param actions - The enum object with actions.
 * @param subject - The enum object with subject(s).
 * @param keysToInclude - An array of keys (from the action enum) that you want to include.
 * @returns An array of objects with the specified action and subject.
 */

export const mapSpecifiedEnumMembersToObjects = (
  actions: Record<string, string>,
  subject: Record<string, string>,
  keysToInclude: string[]
): ActionSubject[] => {
  // Get the subject value. For simplicity, we assume the subject enum has one value.
  const subjectValue = Object.values(subject)[0];

  return Object.entries(actions)
    .filter(([key]) => keysToInclude.includes(key))
    .map(([, value]) => ({ action: value, subject: subjectValue }));
};
