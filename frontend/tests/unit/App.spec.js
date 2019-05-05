jest.mock('@/services/api', () => {
  return {
    removeTool: jest.fn(),
    createTool: jest.fn(),
    getTools: jest.fn()
  }
})

import { mount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import * as uiv from 'uiv'

import App from '@/App'
import api from '@/services/api'

let localVue

describe('App', async () => {
  beforeEach(async () => {
    localVue = createLocalVue()
  })

  describe('lista', async () => {
    it('não deve apresentar a lista', async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = []
        return Promise.resolve(result)
      })
      const wrapper = await mount(App, {
        localVue
      })
      expect(wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(0)
    })

    it('deve apresentar uma lista de tamanho 1', async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = [
          {
            title: 'Título',
            link: 'http://fer.ra/me',
            description: 'Descrição',
            tags: ['t1', 't2']
          }
        ]
        return Promise.resolve(result)
      })
      const wrapper = await mount(App, {
        localVue
      })
      const ferramentas = wrapper.findAll(`[data-set='ferramenta']`)
      expect(ferramentas).toHaveLength(1)
      const ferramenta = ferramentas.at(0)
      expect(ferramenta.find(`[data-set='title']`).text()).toBe('Título')
      expect(ferramenta.find(`[data-set='link']`).attributes('href'))
        .toBe('http://fer.ra/me')
      expect(ferramenta.find(`[data-set='description']`).text())
        .toBe('Descrição')
      const tags = ferramenta.find(`[data-set='tags']`)
      expect(tags.text()).toContain('t1')
      expect(tags.text()).toContain('t2')
    })

    it('deve apresentar uma lista de tamanho 2', async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = [
          { title: 'Ferramenta 1' },
          { title: 'Ferramenta 2' }
        ]
        return Promise.resolve(result)
      })
      const wrapper = await mount(App, {
        localVue
      })
      expect(wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(2)
    })
  })

  describe('adiciona', async () => {
    beforeEach(async () => {
      localVue.use(uiv)
      api.createTool.mockImplementationOnce((tool) => {
        const result = { ...tool, id: 1 }
        return Promise.resolve(result)
      })
    })

    it('deve apresentar uma lista de tamanho 1', async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = []
        return Promise.resolve(result)
      })
      const wrapper = await mount(App, {
        localVue
      })
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(0)
      await wrapper.find(`[action-trigger='nova']`).trigger('click')
      await flushPromises()
      const title = wrapper.find(`[data-input='title']`)
      title.element.value = 'Título'
      title.trigger('change')
      const link = wrapper.find(`[data-input='link']`)
      link.element.value = 'http://li.nk'
      link.trigger('change')
      const description = wrapper.find(`[data-input='description']`)
      description.element.value = 'Descrição'
      description.trigger('change')
      const marcadores = wrapper.find(`[data-input='marcadores']`)
      marcadores.element.value = 't1 t2'
      marcadores.trigger('change')
      await wrapper.find(`[action-trigger='adicionar']`).trigger('click')
      await flushPromises()
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(1)
      expect(api.createTool).toHaveBeenCalledWith({
        link: 'http://li.nk',
        description: 'Descrição',
        tags: ['t1', 't2'],
        title: 'Título'
      })
    })

    it('deve apresentar uma lista de tamanho 2', async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = [{ title: 'Título da Ferramenta 1' }]
        return Promise.resolve(result)
      })
      const wrapper = await mount(App, {
        localVue
      })
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(1)
      await wrapper.find(`[action-trigger='nova']`).trigger('click')
      await flushPromises()
      const title = wrapper.find(`[data-input='title']`)
      title.element.value = 'Título'
      title.trigger('change')
      await wrapper.find(`[action-trigger='adicionar']`).trigger('click')
      await flushPromises()
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(2)
    })

    it('deve apresentar uma lista de tamanho 3', async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = [
          { title: 'Título da Ferramenta 1' },
          { title: 'Título da Ferramenta 2' }
        ]
        return Promise.resolve(result)
      })
      const wrapper = await mount(App, {
        localVue
      })
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(2)
      await wrapper.find(`[action-trigger='nova']`).trigger('click')
      await flushPromises()
      const title = wrapper.find(`[data-input='title']`)
      title.element.value = 'Título'
      title.trigger('change')
      await wrapper.find(`[action-trigger='adicionar']`).trigger('click')
      await flushPromises()
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(3)
    })
  })

  describe('remove', async () => {
    let $confirm

    beforeEach(async () => {
      api.removeTool.mockImplementationOnce(() => {
        return Promise.resolve()
      })
      $confirm = jest.fn().mockImplementationOnce(() => Promise.resolve())
    })

    it('não deve apresentar uma lista', async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = [{ id: 1, title: 'Título da Ferramenta 1' }]
        return Promise.resolve(result)
      })
      const wrapper = await mount(App, {
        mocks: { $confirm },
        localVue
      })
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(1)
      await wrapper.find(`[action-trigger='remover']`).trigger('click')
      await flushPromises()
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(0)
      expect(api.removeTool).toHaveBeenCalledWith(1)
    })

    it('deve apresentar uma lista de tamanho 1', async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = [
          { id: 1, title: 'Título da Ferramenta 1' },
          { id: 2, title: 'Título da Ferramenta 2' }
        ]
        return Promise.resolve(result)
      })
      const wrapper = await mount(App, {
        mocks: { $confirm },
        localVue
      })
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(2)
      await wrapper.find(`[action-trigger='remover']`).trigger('click')
      await flushPromises()
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(1)
    })
  })

  describe('procurar', async () => {
    let wrapper

    beforeEach(async () => {
      api.getTools.mockImplementationOnce(() => {
        const result = [
          { id: 1, title: 'Título da Ferramenta 1', tags: ['a'] },
          { id: 2, title: 'Título da Ferramenta 2', tags: ['a', 'b', 'c'] },
          { id: 3, title: 'Título da Ferramenta 3', tags: ['a', 'c'] }
        ]
        return Promise.resolve(result)
      })
      wrapper = await mount(App, {
        localVue
      })
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(3)
    })

    it('deve filtrar lista pelo critério em todos os atributos', async () => {
      const input = await wrapper.find(`[data-input='criterio']`)
      input.element.value = 'Ferramenta 2',
      input.trigger('keyup')
      expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(1)
    })

    describe('filtrar pelo critério apenas nas tags', async () => {
      it('deve apresentar uma ferramenta', async () => {
        const criterio = await wrapper.find(`[data-input='criterio']`)
        criterio.element.value = 'b',
        criterio.trigger('keyup')
        await wrapper.find(`[data-input='tags']`).trigger('click')
        expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(1)
      })

      it('deve apresentar duas ferramentas', async () => {
        const criterio = await wrapper.find(`[data-input='criterio']`)
        criterio.element.value = 'c',
        criterio.trigger('keyup')
        await wrapper.find(`[data-input='tags']`).trigger('click')
        expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(2)
      })

      it('deve apresentar três ferramentas', async () => {
        const criterio = await wrapper.find(`[data-input='criterio']`)
        criterio.element.value = 'a',
        criterio.trigger('keyup')
        await wrapper.find(`[data-input='tags']`).trigger('click')
        expect(await wrapper.findAll(`[data-set='ferramenta']`)).toHaveLength(3)
      })
    })
  })
})
