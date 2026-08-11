export class ComponentNodeDto {
  id!: string;
  nameEN!: string;
  componentData!: Record<string, any>;
  componentSettings!: Record<string, any>;
  children!: ComponentNodeDto[];
}
