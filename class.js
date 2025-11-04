class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    greet() {
        return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
    }
}

module.exports = Person;      
// Example usage:
// const Person = require('./class');
// const john = new Person('John', 30);
// console.log(john.greet()); // Output: Hello, my name is John and I am 30 years old.