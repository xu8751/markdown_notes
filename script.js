// New VueJS instance
Vue.filter('data',time=> moment(time).format('DD/MM/YY,  HH:mm'))
new Vue({
  name: 'notebook',

  // CSS selector of the root DOM element
  el: '#notebook',

  // Some data
  data () {
    return {
      // content: 'This is a note',
      content: localStorage.getItem('content') || 'You can write in **markdown**',
      //笔记数组

      notes: JSON.parse(localStorage.getItem('notes'))|| [],
      selectedId: localStorage.getItem('selected-id')|| null

    }
  },

  // Computed properties
  computed: {
    notePreview () {
      // Markdown rendered to HTML
      return this.selectedNote ? marked(this.selectedNote.content) : ''
    },
    selectedNote(){
      return this.notes.find(note => note.id ===this.selectedId)
    },
      sortedNotes () {
          return this.notes.slice().sort((a, b) => a.created - b.created)
              .sort((a, b) => (a.favorite === b.favorite)? 0 : a.favorite? -1 : 1)
      },
      linesCount () {
          if (this.selectedNote) {
              // Count the number of new line characters
              return this.selectedNote.content.split(/\r\n|\r|\n/).length
          }
      },

      wordsCount () {
          if (this.selectedNote) {
              var s = this.selectedNote.content
              // Turn new line cahracters into white-spaces
              s = s.replace(/\n/g, ' ')
              // Exclude start and end white-spaces
              s = s.replace(/(^\s*)|(\s*$)/gi, '')
              // Turn 2 or more duplicate white-spaces into 1
              s = s.replace(/[ ]{2,}/gi, ' ')
              // Return the number of spaces
              return s.split(' ').length
          }
      },

      charactersCount () {
          if (this.selectedNote) {
              return this.selectedNote.content.split('').length
          }
      },
  },

  // Change watchers
  watch: {
    /*content: {
      handler (val, oldVal) {
        console.log('new note:', val, 'old note:', oldVal)
        localStorage.setItem('content', val)
      },
      immediate: true,
    },*/

    /*content (val) {
      localStorage.setItem('content', val)
    },*/

    /*content: {
      handler: 'saveNote',
    },*/

   /*content: {
    handler: 'saveNote',
   }*/
   notes:{
       handler:'saveNotes',
       deep:true,
   },
   selectedId(val){
       localStorage.setItem('selected-id',val)
   },
  },

  methods: {
    saveNotes(){

      localStorage.setItem('notes', JSON.stringify(this.notes))
        console.log('Notes,saved',new Date())
    },
    addNote(){
      const time = Date.now()
      const note = {
        id:String(time),
        title :'New note'+(this.notes.length + 1),
        content:'**Hi!** This notebook is using[MarkDown]',
        created:time,
        favorite:false,

      }
      this.notes.push(note)

        /*this.selectNote(note)*/
    },

    selectNote (note){
      this.selectedId= note.id
    },
    removeNote(){
        if(this.selectedNote&& confirm('Delete the note?')){
            /*  将选中得内容删除*/
            const index = this.notes.indexOf(this.selectedNote)
            if(index !== -1){
                this.notes.splice(index,1)
            }
        }


    },
    favoriteNote(){
        this.selectedNote.favorite = !this.selectedNote.favorite
    }
   /* saveNote (val, oldVal) {
      console.log('new note:', val, 'old note:', oldVal)
      console.log('saving note:', this.content)
      localStorage.setItem('content', this.content)
      this.reportOperation('saving')
    },
    reportOperation (opName) {
      console.log('The', opName, 'operation was completed!')
    },*/
  },
   // console.log('restored note:',localStorage.getItem('content'))
  /* created () {
    this.content = localStorage.getItem('content') || 'You can write in **markdown**'
  }, */
})
