/** A message that changes with a count. `{n}` is replaced by the count. */
export type Plural = { other: string } & Partial<Record<Intl.LDMLPluralRule, string>>
