// コンパイル後にインポートするので、拡張子は[js]
import { ProjectInput } from './components/project-input.js';
import { ProjectList } from './components/project-list.js';

new ProjectInput();
new ProjectList('active');
new ProjectList('finished');
