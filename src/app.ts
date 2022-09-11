// Project State Management
class ProjectState {
  private listeners: any[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {}

  static getInstace() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, manday: number) {
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      manday: manday,
    };
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstace();
// validation
interface Validatable {
  value: string | number;
  required?: boolean; //?はnullを許容する boolean | undefinedと同様
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}
// autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

// ProjectList Class
class ProjectList {
  templateElemtnt: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: 'active' | 'finished') {
    this.templateElemtnt = document.getElementById('project-list') as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;
    this.assignedProjects = [];
    const importedNode = document.importNode(this.templateElemtnt.content, true);
    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      this.renderProject();
    });

    this.attach();
    this.renderContent();
  }

  private renderProject() {
    const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type === 'active' ? '実行中プロジェクト' : '完了プロジェクト';
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }
}
// ProjectInput Class
class ProjectInput {
  templateElemtnt: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    this.templateElemtnt = document.getElementById('project-input') as HTMLTemplateElement;
    this.hostElement = document.getElementById('app') as HTMLDivElement;
    const importedNode = document.importNode(this.templateElemtnt.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector('#manday') as HTMLInputElement;

    this.configure();
    this.attach();
  }
  private gatherUserInput(): [string, string, number] | void {
    const enterdTitle = this.titleInputElement.value;
    const enterdDescription = this.descriptionInputElement.value;
    const enterdManday = this.mandayInputElement.value;

    const titleValidatable: Validatable = {
      value: enterdTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enterdDescription,
      required: true,
      minLength: 5,
    };
    const mandayValidatable: Validatable = {
      value: +enterdManday,
      required: true,
      min: 1,
      max: 1000,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(mandayValidatable)
    ) {
      alert('入力値が正しくありません。');
    } else {
      return [enterdTitle, enterdDescription, +enterdManday];
    }
  }

  private clearInput() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.mandayInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, manday] = userInput;
      projectState.addProject(title, desc, manday);
      this.clearInput();
    }
  }
  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
