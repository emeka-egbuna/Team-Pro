const { open, close, appendFile } = require('node:fs');

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.
let manager  = null;
let engineer = null;
let intern   = null;

const EmployeeArray = [];

// array of questions for user
const questions = [
    {
        type: "input",
        name: "name",
        message: "Team Manager's name",
        validate: (name) => {
            if(!name.length) {
              return 'Please provide employee name';
            }
            if(name.length > 15) {
              return 'Please name must be not more than 15 characters long';
            }
      
            return true;
          },
          filter: (name) => {
            return name.trim();
          }
    },
    {
        type: "input",
        name: "id",
        message: "Employee ID",
        validate: (id) => {
            if(id.length <= 0) {
              return 'Please enter a number greater than zero (0)';
            }
            if((typeof Number(id)) !== "number") {
              return 'Please enter a valid number';
            }
      
            return true;
          },
          filter: (id) => {
            return Number(id);
          }
    },
    {
        type: "input",
        name: "email",
        message: "Email address",
        validate: (email) => {
            const result = validateEmail(email)
                    ? true : "Please enter a valid email ID";
      
            return result;
        }
    },
    {
        type: "input",
        name: "officeNum",
        message: "Office number",
        validate: (officeNum) => {
            if(officeNum.length <= 0) {
              return 'Please enter a number greater than zero (0)';
            }
            if((typeof Number(officeNum)) !== "number") {
              return 'Please enter a valid number';
            }
      
            return true;
          },
          filter: (officeNum) => {
            return Number(officeNum);
          }
    },
    {
        type: "checkbox",
        name: "employees",
        message: "Add other Employees",
        choices: [
            "Add an Engineer",
            "Add an Intern"
        ],
        validate: (employees) => {
          if (!employees.length) {
            return 'Choose at least one of the above, use space to choose the option'
          }
    
          return true;
        }
    }
];

// array of questions for user
const engineerQuestions = [
    {
        type: "input",
        name: "name",
        message: "Engineer's name",
        validate: (name) => {
            if(!name.length) {
              return 'Please provide engineer\'s name';
            }
            if(name.length > 15) {
              return 'Please engineer\'s name must be not more than 15 characters long';
            }
      
            return true;
          },
          filter: (name) => {
            return name.trim();
          }
    },
    {
        type: "input",
        name: "id",
        message: "Engineer\'s employee ID",
        validate: (id) => {
            if(id.length <= 0) {
              return 'Please enter a number greater than zero (0)';
            }
            if((typeof Number(id)) !== "number") {
              return 'Please enter a valid number';
            }
      
            return true;
          },
          filter: (id) => {
            return Number(id);
          }
    },
    {
        type: "input",
        name: "email",
        message: "Engineer\'s mail address",
        validate: (email) => {
            const result = validateEmail(email)
                    ? true : "Please enter a valid email ID";
      
            return result;
        }
    },
    {
        type: "input",
        name: "github",
        message: "GitHub username",
        validate: (github) => {
            const result = isValidUsername(github) ? true : "not a valid GitHub username";
      
            return result;
        }
    }
];

// array of questions for user
const internQuestions = [
    {
        type: "input",
        name: "name",
        message: "Intern's name",
        validate: (name) => {
            if(!name.length) {
              return 'Please provide intern\'s name';
            }
            if(name.length > 15) {
              return 'Please intern\'s name must be not more than 15 characters long';
            }
      
            return true;
          },
          filter: (name) => {
            return name.trim();
          }
    },
    {
        type: "input",
        name: "id",
        message: "Intern\'s ID",
        validate: (id) => {
            if(id.length <= 0) {
              return 'Please enter a number greater than zero (0)';
            }
            if((typeof id) !== "number") {
              return 'Please enter a valid number';
            }
      
            return true;
          },
          filter: (id) => {
            return Number(id);
          }
    },
    {
        type: "input",
        name: "email",
        message: "Intern\'s mail address",
        validate: (email) => {
            const result = validateEmail(email)
                    ? true : "Please enter a valid email ID";
      
            return result;
        }
    },
    {
        type: "input",
        name: "school",
        message: "Intern's school",
        validate: (school) => {
            if(!school.length) {
              return 'Please provide intern\'s name';
            }
            if(school.length > 50) {
              return 'Please intern\'s name must be not more than 50 characters long';
            }
      
            return true;
          },
          filter: (school) => {
            return school.trim();
          }
    }
];

/*
{
    type: "loop",
    name: "items",
    message: "Add another item?",
    questions: engineerQuestions
}
*/

const engineerDetails = (employeeArray, questions) => {
    inquirer
        .prompt(
            questions
        ).then(
            engineerAnswers => {
                //console.log(answers);
                engineer = new Engineer(engineerAnswers.name,
                    engineerAnswers.id, engineerAnswers.email, engineerAnswers.github);

                    employeeArray.push(manager);
                  //  writeToFile("team.html", render(EmployeeArray[1]));
            }
        )
}

const internDetails = (employeeArray, questions) => {
    inquirer
        .prompt(
            questions
        ).then(
            internAnswers => {
                //console.log(answers);
                intern = new Intern(internAnswers.name,
                    internAnswers.id, internAnswers.email, internAnswers.school);
                
                employeeArray.push(intern);
                  //  writeToFile("team.html", render(EmployeeArray[2]));
            }
        )
}

function closeFd(fd) {
    close(fd, (err) => {
      if (err) throw err;
    });
}

// function to write file
const writeToFile = (file, data) => {
    open(file, 'a', (err, fd) => {
        if (err) throw err;
      
        try {
          appendFile(fd, data, 'utf8', (err) => {
            closeFd(fd);
            if (err) throw err;
          });
        } catch (err) {
          closeFd(fd);
          throw err;
        }
      });
}

// Regexp from Devshed: https://web.archive.org/web/20110806041156/http://forums.devshed.com/javascript-development-115/regexp-to-match-url-pattern-493764.html
const validURL = str => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

const isValidUsername = username => {
    return String(username)
        .match(/^[0-9A-Za-z][0-9A-Za-z_-]{2,16}$/);
}

// Email address validation function taken from Chromium: https://cs.chromium.org/chromium/src/third_party/blink/web_tests/fast/forms/resources/ValidityState-typeMismatch-email.js?q=ValidityState-typeMismatch-email.js&sq=package:chromium&dr
const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

// function to initialize program
function init() {
    inquirer
        .prompt(
            /* Pass your questions in here */
            questions
        )
        .then((answers) => {
            manager = new Manager(answers.officeNum, answers.name,
                answers.id, answers.email);

            EmployeeArray.push(manager);
            //writeToFile("team.html", render(EmployeeArray[0]));
            //console.log(answers);
            for(const option of answers.employees) {
                if (option === "Add an Engineer") {
                  try {
                    engineerDetails(EmployeeArray, engineerQuestions);
                  } catch (error) {
                    console.error(`There was an error calling the function: ${error.message}`, error);
                  }
                }
                
                if (option === "Add an Intern") {
                  try {
                    internDetails(EmployeeArray, internQuestions);
                  } catch (error) {
                    console.error(`There was an error calling the function: ${error.message}`, error);
                  }
                }
            }
console.log(EmployeeArray);
            writeToFile("team.html", render(EmployeeArray));
        });
}

// function call to initialize program
init();

