export {}

declare module "vue" {
  type Hooks = App.AppInstance & Page.PageInstance;
  interface ComponentCustomOptions extends Hooks {}
}

declare global {
  interface Uni {
    $u?: any
  }
  interface Uni {
    $uv?: any
  }
}

declare module '*.js'
declare module '@climblee/uv-ui';
