const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let userList = []
let userId = 1

async function main(){
    const managerInfo = await inquirer.prompt([
        {
            name: "name",
            message: "Manager's Name"
        },
        {
            name: "id",
            message: "Manager's ID Number"
        },
        {
            name: "email",
            message: "Manager's Email"
        },
        {
            name: "officeNumber",
            message: "Manager's Office Number"
        },
        {
            name: "teamMembers",
            message: "Number of Team Members"
        }]
    )

    const manager = new Manager( managerInfo.name, managerInfo.id, managerInfo.email, managerInfo.officeNumber )
    userList.push( manager )
    for( var i=0; i<managerInfo.teamMembers; i++ ){
        let employeeRole = await inquirer.prompt([
            {
              type: "list",
              name: "role",
              message: "Employee Role",
              choices: [
                "Engineer",
                "Intern"
              ]
            } ] )
        employeeRole = employeeRole.role

        const employeeInfo = await inquirer.prompt([
            {
                name: "name",
                message: `${employeeRole}'s Name`
            },
            {
                name: "id",
                message: `${employeeRole}'s ID Number`
            },
            {
                name: "email",
                message: `${employeeRole}'s Email`
            },            
            {
                name: "info",
                message: `${employeeRole}'s ${employeeRole=='Engineer' ? 'GitHub Username' : 'School'}`
            } ])

        const employee = employeeRole==='Engineer' 
            ? new Engineer( employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeInfo.info )
            : new Intern( employeeInfo.name, employeeInfo.id, employeeInfo.email, employeeInfo.info )
        userList.push( employee )
    }

    if( !fs.existsSync(OUTPUT_DIR) ) fs.mkdirSync(OUTPUT_DIR)
    fs.writeFileSync(outputPath, render(userList), "utf-8");

    console.log( `Completed list to: ${outputPath}` )
}
main()

