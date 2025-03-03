# Expert Institute Technical Interview Project

This project was created to satisfy the technical aspect of the Expert Institute full stack developer interview process

## Description

This project is an Angular web app that uses [CoinCap API 2.0](https://docs.coincap.io/) for data. The app allows you to view a high level overview of all assets fetched from CoinCap as well as a detailed view of each asset that includes additional information. It also includes a wallet that allows you to simulate buying and selling of assets. The wallet page should reflect the assets you currently have, each individual assets value is USD, the accumulated value of your wallet and the historical performance of your wallet. Changes made to your wallet are cached into local storage and should persist between session, 

### Dependencies

* Node.js version 20.18.3
* Angular version 17.3.12

### Executing program

* To run the app, ensure you are in the root directory and type the command ng serve in the terminal.
* If you you would like the page to open automatically use ng serve -o, but if not the app should be running on http://localhost:4200/

### Testing

* Testing via Jest has been configured.
* While the test coverage is severely lacking, they should still run with the command npm test

## Help

For any questions or issues, feel free to email me at fmartsula@gmail.com

## Author

Finn Tomasula Martin

