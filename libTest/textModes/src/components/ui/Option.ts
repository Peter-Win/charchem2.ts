export type BaseValue = string | number | undefined;

export type Option<TValue extends BaseValue> = {
  value: TValue;
  label: React.ReactNode;
}
