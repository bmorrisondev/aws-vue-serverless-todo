<template>
  <div id="app">
    <h1>Vue Todo App</h1>
    <div class="add-task-wrapper">
      <input type="text" v-model="newTaskInput" @keydown.enter="addTask">
      <button @click="addTask">Add task</button>
    </div>
    <div class="task" v-for="task in tasks" :key="task.id">
      <div class="task-main">
        <span>{{ task.name }}</span>
        <span class="buttons">
          <button @click="browseForImage(task.id)">🌆</button>
          <button @click="removeTask(task.id)">❌</button>
        </span>
        <input :id="`fileInput-${task.id}`" type="file" class="file-input" @change="event => attachImage(event, task)" />
      </div>
      <div class="task-img" v-if="task.imageUrl">
        <img :src="task.imageUrl" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',


  
  data() {
    return {
      newTaskInput: "",
      tasks: []
    }
  },


  async created() {
    const response = await fetch("https://kclm3lr6h5.execute-api.us-east-1.amazonaws.com/todos")
    this.tasks = await response.json()
  },
  methods: {
    async addTask() {
      let taskId = Math.floor(Math.random() * (999999999 - 100000000) + 100000000)
      let newTask = {
        id: taskId,
        name: this.newTaskInput
      }
      await fetch("https://kclm3lr6h5.execute-api.us-east-1.amazonaws.com/todos", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
      })
      this.tasks.push(newTask)
      this.newTaskInput = ""
    },

    async removeTask(taskId) {
      await fetch("https://kclm3lr6h5.execute-api.us-east-1.amazonaws.com/todos", {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: taskId})
      })
      this.tasks = this.tasks.filter(t => t.id !== taskId)
    },

    async getDataUrl(file) {
      const reader = new FileReader()
      return new Promise(resolve => {
        reader.onload = event => resolve(event.target.result)
        reader.readAsDataURL(file)
      })
    },

    async browseForImage(id) {
      const inputEl = document.getElementById(`fileInput-${id}`)
      inputEl.click()
    },

    async attachImage(event, task) {
      let file = event.target.files[0]
      let dataUrl = await this.getDataUrl(file)

      let imageReqBody = {
        fileName: file.name,
        fileData: dataUrl
      }
      let imageRes = await fetch("https://kclm3lr6h5.execute-api.us-east-1.amazonaws.com/images", {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(imageReqBody)
      })
      let imageResponseJson = await imageRes.json();
      
      task.imageUrl = imageResponseJson.imageUrl

      await fetch("https://kclm3lr6h5.execute-api.us-east-1.amazonaws.com/todos", {
        method: 'put',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
      })

      this.$forceUpdate()
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 500px;
  margin: 0 auto;
}

button, input {
  border-radius: 5px;
  padding: 5px 10px;
  border: 1px solid #aaa;
  margin: 5px;
}

.add-task-wrapper {
  display: flex;
}

.add-task-wrapper input {
  flex: 1
}

.task {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;
  border-radius: 5px;
  margin: 5px 10px;
  padding: 5px 10px;
}

.task-main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-img img {
  max-width: 40%;
  border: 1px solid white;
}

.file-input {
  display: none;
  visibility: hidden;
}
</style>
