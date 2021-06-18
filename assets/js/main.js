

class BaseElement {
    constructor(text, checked = false) {
        this.text = text;
        this.checked = checked

    }
}

class Element extends BaseElement {
    constructor(text, elements = null, checked = false, date = "", time = "") {
        super(text, checked);
        this.elements = elements ?? [];
        this.showMode = true;
        this.showDate = false;
        this.date = date;
        this.time = time;
    }


    setAll() {
        if (!this.checked) {
            if (this.elements.filter(el => !el.checked).length == 0) {
                this.checked = !this.checked;
            }
        }
    }

    getDate() {
        if (this.date != "") {
            return new Date(this.date + "T" + "00:00:00");

        }
        else {
            return new Date(0);
        }
    }

}




const app = new Vue({
    mounted() {

        this.list = JSON.parse(localStorage.getItem("list") ?? '[]').map(item => new Element(item.text, item.elements.map(subItem => new BaseElement(subItem.text, subItem.checked)), item.checked, item.date, item.time));
    },

    el: '#app',
    data: {

        list: [
            new Element("sad", [new BaseElement("sad1"), new BaseElement("sad2"), new BaseElement("sad3")]),
        ],
        isCurrentList: true,
        newItemText: null,
        findString: '',

    },
    watch: {

        list: {
            handler() {
                this.writeToLocalStorage();
            },
            deep: true
        }

    },
    computed: {
        unicDays() {

            return [...new Set(this.currentList.map(el => el.getDate().toString()))].sort((a, b) => {
                return new Date(a) - new Date(b);

            })
        },

        activeList() {
            return this.list.filter(el => !el.checked)
        },
        endList() {
            return this.list.filter(el => el.checked)
        },
        currentList() {
            let currentList = this.isCurrentList ? this.activeList : this.endList;


            return currentList.filter(el => el.text.toLowerCase().includes(this.findString.toLowerCase()));
        }


    },
    methods: {
        addNew() {
            this.list.push(new Element(""));
            this.writeToLocalStorage();

        },
        writeToLocalStorage() {
            localStorage.setItem("list", JSON.stringify(this.list));
        },


        getString(date) {
            if ("Thu Jan 01 1970 03:00:00 GMT+0300 (Москва, стандартное время)" == date) {
                return "Незаполненные";
            }
            else if (new Date(date).getDate() === new Date().getDate() && new Date(date).getMonth() === new Date().getMonth() && new Date(date).getYear() === new Date().getYear()) {
                return "Сегодня";
            }
            else if (new Date(date).getDate() === new Date().getDate() + 1 && new Date(date).getMonth() === new Date().getMonth() && new Date(date).getYear() === new Date().getYear()) {
                return "Завтра";
            }
            else if (new Date(date) < new Date()) {
                return "Просроченные";
            }
            else {
                return new Date(date).toLocaleDateString("ru", { day: "numeric", month: "long" });
            }
        },

        getTodoDay(day) {
            return this.currentList.filter(el => el.getDate().toString() === day).sort((a, b) => {
                if (a.time != "" && b.time != "") {
                    return new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
                }
            })
        },
        delete(item) {
            this.list.splice(this.list.indexOf(item), 1);
        }
    }

});


