
const Main = () => import('@/components/main');
const ParentView= () => import('@/components/parent-view');
const Home = () => import('@/view/single-page/home');
const JoinPage = () => import('@/view/join-page.vue');
const CountTo = () => import('@/view/components/count-to/count-to.vue');
const DragList = () => import('@/view/components/drag-list/drag-list.vue');
const Tables = () => import('@/view/components/tables/tables.vue');
const SplitPane = () => import('@/view/components/split-pane/split-pane.vue');
const MarkDown = () => import('@/view/components/markdown/markdown.vue');
const Editor = () => import('@/view/components/editor/editor.vue');
const TinymceEditor = () => import('@/view/components/tinymce-editor/tinymce-editor.vue');
const Icons = () => import('@/view/components/icons/icons.vue');
const Roles = () => import('@/view/components/roles/roles.vue');

export default {
  Main,
  ParentView,
  Home,
  JoinPage,
  CountTo,
  DragList,
  Tables,
  SplitPane,
  MarkDown,
  Editor,
  TinymceEditor,
  Icons,
  Roles
};
