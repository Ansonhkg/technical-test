import { mount } from '@vue/test-utils'
import Upload from '@/components/global/Forms/Upload.vue'

describe('Upload', () => {

  const wrapper = mount(Upload)

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain('Drop your file here')
  })

  test('file is empty when it\'s first loaded', () =>{
    expect(wrapper.vm.file).toBe('')
  })

  it('has a delete button when file is NOT empty', () =>{
    wrapper.vm.file = 'test.doc'
    expect(wrapper.contains('button')).toBe(true)
  })

  it('emits selectedFile event when a file is uploaded', () => {
    wrapper.vm.file = 'test.doc'
    expect(wrapper.emitted().selectedFile).toBeTruthy()
  })
})