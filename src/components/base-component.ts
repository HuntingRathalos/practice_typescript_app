// Component Class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElemtnt: HTMLTemplateElement;
  hostElement: T;
  element: U;
  // 任意の引数は最後に定義する必要あり
  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElemtnt = document.getElementById(templateId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId) as T;

    const importedNode = document.importNode(this.templateElemtnt.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  abstract configure(): void;
  abstract renderContent(): void;

  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
}
