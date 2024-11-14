"use strict";
class Osoba {
  constructor(name, yearOfBirth) {
    this._name = name;
    this._yearOfBirth = yearOfBirth;
  }

  get name() {
    return this._name;
  }

  get age() {
    return new Date().getFullYear() - this._yearOfBirth;
  }

  set name(value) {
    if (typeof value === "string" && value.trim() !== "") {
      this._name = value;
    } else {
      throw new Error("Nazwa nie może być pusta.");
    }
  }

  set yearOfBirth(value) {
    if (
      typeof value === "number" &&
      value >= 1900 &&
      value <= new Date().getFullYear()
    ) {
      this._yearOfBirth = value;
    } else {
      throw new Error(
        "Rok urodzenia musi być liczbą całkowitą w przedziale od 1900 do obecnego roku."
      );
    }
  }
}

class Student extends Osoba {
  constructor(name, yearOfBirth, indexNumber) {
    super(name, yearOfBirth);
    this._indexNumber = indexNumber;
  }

  get indexNumber() {
    return this._indexNumber;
  }

  set indexNumber(value) {
    this._indexNumber = value;
  }
}

class Wykladowca extends Osoba {
  constructor(name, yearOfBirth, salary) {
    super(name, yearOfBirth);
    this._salary = salary;
  }

  get salary() {
    return this._salary;
  }

  set salary(value) {
    this._salary = value;
  }
}

function testPartTwo() {
  let osoba = new Osoba("Jan", 1990);
  console.log(osoba.name); // Jan
  console.log(osoba.age); // 34

  let student = new Student("Anna", 1995, "123456");
  console.log(student.name); // Anna
  console.log(student.age); // 29
  student.name = "Marek";
  console.log(student.name); // Marek
  student.yearOfBirth = 1980;
  console.log(student.age); // 44
  console.log(student.indexNumber); // 123456

  let wykladowca = new Wykladowca("Adam", 1985, 5000);
  console.log(wykladowca.name); // Adam
  console.log(wykladowca.age); // 39
  console.log(wykladowca.salary); // 5000
  wykladowca.name = "Janusz";
  wykladowca.yearOfBirth = 1975;
  wykladowca.salary = 6000;
  console.log(wykladowca.name); // Adam
  console.log(wykladowca.age); // 49
  console.log(wykladowca.salary); // 5000
}
