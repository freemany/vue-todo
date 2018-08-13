import Utils from '@/lib/Utils'

export default {
    storageKey: '__todo_vue__',
    defaultItems: [
        {title: 'freeman', done: false, editing: false, id: Utils.guid(), new: false},
        {title: 'tia', done: false, editing: false, id: Utils.guid(), new: false},
    ]
}