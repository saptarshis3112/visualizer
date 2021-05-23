class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.current = false;
  }
};

class LinkedList {

  constructor() {
    this.head = null;
  }

  async searchNode(value) {

    let transitions = [];
    let ls = await this.getCurrentNumList().value;
    let index = 0;
    let current = this.head;

    while (current != null) {

      let tempLs = ls.map((item, i) => {
        if (index == i) {
          return {
            ...item,
            current: true,
          };
        } else {
          return {
            ...item,
            current: false,
          }
        }
      });
      transitions.push(tempLs);

      if (current.value == value) return transitions;

      current = current.next;
      index++;
    }

    let tempLs = ls.map((item, i) => {

      return {
        ...item,
        current: false,
      }

    });
    transitions.push(tempLs);

    return transitions;

  }

  getSize() {
    let size = 0, n = this.head;
    while (n != null) {
      size++;
      n = n.next;
    }
    return size;
  }

  async addFront(value) {
    let newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;
    return this.getCurrentNumList();
  }

  async addLast(value) {
    let newNode = new ListNode(value);

    if (!this.head) {
      newNode.next = this.head;
      this.head = newNode;
      return this.getCurrentNumList();;
    }

    let last = this.head;
    while (last.next != null) {
      last = last.next;
    }

    newNode.next = last.next;
    last.next = newNode;

    return this.getCurrentNumList();
  }

  async reverse() {

    let current = this.head, prev = null, next = null;

    while (current != null) {

      next = current.next;
      current.next = prev;
      prev = current;
      current = next;

    }

    this.head = prev;
    return await this.getCurrentNumList();

  }

  getCurrentNumList() {

    let ls = [];
    let current = this.head;
    let prev = null;

    while (current != null) {

      if (prev == null) {
        ls.push({ ...current, isHead: true });
      } else {
        ls.push({ ...current, isHead: false });
      }

      prev = current;
      current = current.next;
    }

    return {
      value: ls,
      size: ls.length,
    };
  }

  deleteNode(value) {

    let current = this.head, prev = null;

    while (current != null) {

      if (current.value == value) {

        // First element
        if (prev == null) {
          this.head = this.head.next;
        } else {
          prev.next = current.next;
          current = null;
        }

        return this.getCurrentNumList();

      }

      prev = current;
      current = current.next;

    }

    return this.getCurrentNumList();

  }

  freeList() {
    this.head = null;
    return this.getCurrentNumList();
  }

};

export { LinkedList };
