export interface Page {
  id: string;
  nameEN: string;
  nameAR: string;
  isVisible: boolean;
  index: number;
}

export interface Section {
  id: string;
  nameEN: string;
  nameAR: string;
  index: number;
  pageId: string; // uuid of page
}

export interface Component {
  id: string;
  nameEN: string;
  nameAR: string;
  index: number;
  parentId: string | null; // uuid of parent
}

export interface SectionComponent {
  id: string;
  sectionId: string;
  componentId: string;
  index: number;
  componentData: Record<string, any>;
  componentSettings: Record<string, any>;
}

export interface FullPageTree {
  id: string;
  nameEN: string;
  nameAR: string;
  isVisible: boolean;
  sections: {
    id: string;
    nameEN: string;
    nameAR: string;
    index: number;
    sectionComponents: {
      id: string;
      index: number;
      componentData: Record<string, any>;
      componentSettings: Record<string, any>;
      component: {
        id: string;
        nameEN: string;
        nameAR: string;
        children: {
          id: string;
          nameEN: string;
          nameAR: string;
        }[];
      };
    }[];
  }[];
}
export interface IPageRepository {
  findAllVisible(): Promise<Page[]>;
  findByUuid(uuid: string): Promise<Page | null>;
  findByNameEN(name: string): Promise<FullPageTree | null>;
  save(page: Page): Promise<void>;
  delete(uuid: string): Promise<void>;
}

export interface ISectionRepository {
  findByPageUuid(pageUuid: string): Promise<Section[]>;
  findByUuid(uuid: string): Promise<Section | null>;
  save(section: Section): Promise<void>;
  delete(uuid: string): Promise<void>;
}

export interface IComponentRepository {
  findByUuid(uuid: string): Promise<Component | null>;
  findManyByUuids(uuids: string[]): Promise<Component[]>;
  findAll(): Promise<Component[]>;
  save(component: Component): Promise<void>; // save a new component definition
  delete(uuid: string): Promise<void>; // delete component definition
}

export interface ISectionComponentRepository {
  findBySectionUuid(sectionUuid: string): Promise<SectionComponent[]>; // find all components in a section
  save(sc: SectionComponent): Promise<void>; // save component instance in a section
  delete(uuid: string): Promise<void>; // delete component instance in a section
}

export const I_PAGE_REPOSITORY = Symbol('PAGE_REPOSITORY');
export const I_SECTION_REPOSITORY = Symbol('SECTION_REPOSITORY');
export const I_COMPONENT_REPOSITORY = Symbol('COMPONENT_REPOSITORY');
export const I_SECTION_COMPONENT_REPOSITORY = Symbol(
  'SECTION_COMPONENT_REPOSITORY',
);
