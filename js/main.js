document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal'),
    modalBtn = document.querySelector('.todo__task-btn'),
    closeModal = modal.querySelector('.modal__close'),
    body = document.body

  const hideModal = () => {
    modal.classList.remove('modal--open')
    body.classList.remove('body--fixed')
  }

  modalBtn.addEventListener('click', () => {
    modal.classList.add('modal--open')
    body.classList.add('body--fixed')
  })

  closeModal.addEventListener('click', event => {
    event.preventDefault()
    hideModal()
  })

  modal.addEventListener('click', event => {
    if (event.target && event.target.classList.contains('modal')) hideModal()
  })

  document.addEventListener('keydown', event => {
    if (event.code == 'Escape' && modal.classList.contains('modal--open')) hideModal()
  })

  const form = document.querySelector('form'),
    list = document.querySelector('.todo__list'),
    input = form.querySelector('.input')

  let tasks = []

  if (localStorage.getItem('task')) {
    tasks = JSON.parse(localStorage.getItem('task'))
  }

  tasks.forEach(task => render(task))
  checkEmptyList()

  const saveToLS = () => localStorage.setItem('task', JSON.stringify(tasks))

  const addTask = event => {
    event.preventDefault()

    const inputText = input.value

    const newTask = {
      id: Date.now(),
      text: inputText,
      done: false
    }

    render(newTask)

    tasks.push(newTask)

    input.value = ''
    hideModal()
    checkEmptyList()
    saveToLS()
  }

  const deleteTask = event => {
    if (!event.target.classList.contains('todo__delete')) return
    const parentNode = event.target.closest('.todo__item')
    parentNode.remove()

    const taskId = Number(parentNode.id)
    tasks = tasks.filter(task => task.id !== taskId)

    checkEmptyList()
    saveToLS()
  }

  const doneTask = event => {
    if (!event.target.classList.contains('todo__do')) return
    const parentNode = event.target.closest('.todo__item')
    parentNode.classList.add('todo__item--through')

    const taskId = Number(parentNode.id)
    const findTusk = tasks.find(task => task.id == taskId)

    findTusk.done = true
    saveToLS()
  }

  function checkEmptyList() {
    if (tasks.length < 1) {
      const empty = `<li class="todo__empty">СПИСОК ПУСТ</li>`
      list.insertAdjacentHTML('afterbegin', empty)
    } else {
      const emptyEl = document.querySelector('.todo__empty')
      emptyEl ? emptyEl.remove() : null
    }
  }

  function render(task) {
    const cssClass = task.done ? 'todo__item todo__item--through ' : 'todo__item'
    const taskHTML = `
      <li id="${task.id}" class="${cssClass}">
      ${task.text}
      <div class="todo__btns">
          <button class="btn-reset todo__do"><img src="./img/do-img.svg" class="todo__do-img" loading="lazy"
            width="20" height="20" alt="Задание выполнено"></button>
          <button class="btn-reset todo__delete"><img src="./img/rubbish.svg" class="todo__delete-img" loading="lazy"
            width="24" height="24" alt="Пустой квадрат"></button>
      </div>
      </li>
      `
    list.insertAdjacentHTML('beforeend', taskHTML)
  }

  form.addEventListener('submit', addTask)
  list.addEventListener('click', deleteTask)
  list.addEventListener('click', doneTask)
})




