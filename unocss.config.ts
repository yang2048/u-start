import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup, } from 'unocss'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import { presetUni } from '@uni-helper/unocss-preset-uni'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist', '.git', '.husky', '.vscode', 'public', 'build', 'mock', './stats.html'],
    },
  },
  presets: [
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        local: FileSystemIconLoader('./src/static/svg'),
      },
    }),
    presetUni({
      remRpx: false,
      uno: {
        dark: 'class',
      },
    }),
  ],
  transformers: [
    transformerDirectives(), // 启用 @apply 功能
    transformerVariantGroup(), // 启用 () 分组功能
  ],
  shortcuts: [
    {
      'center': 'flex justify-center items-center',
      'border-base': 'border border-gray-500_10',
      'cover-image': 'flex-1 h-300',
      'cover-text': 'absolute bottom-0 text-16px h-30px lh-30px bg-black bg-op-20 w-100%',
      'wh-full': 'w-full h-full',
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'custom-cover': 'relative flex',
      'flex-col-center': 'flex-center flex-col',
      'flex-x-center': 'flex justify-center',
      'flex-y-center': 'flex items-center',
      'fixed-center': 'fixed left-0 top-0 flex-center wh-full',
      'nowrap-hidden': 'whitespace-nowrap overflow-hidden',
      'ellipsis-text': 'nowrap-hidden text-ellipsis',
      'transition-base': 'transition-all duration-300 ease-in-out',
      'absolute-lt': 'absolute left-0 top-0',
      'absolute-lb': 'absolute left-0 bottom-0',
      'absolute-rt': 'absolute right-0 top-0',
      'absolute-rb': 'absolute right-0 bottom-0',
      'absolute-center': 'absolute-lt flex-center wh-full'
    },
  ],
  theme: {
    colors: {
      primary: 'var(--uv-primary)',
      info: 'var(--uv-info)',
      warning: 'var(--uv-warning)',
      error: 'var(--uv-error)',
      success: 'var(--uv-success)',
    },
  },
})
