# Data Collector

This code is part of my Master's Thesis at NTNU, Fall 2021.
![DataPresenter](https://github.com/Jesperpaulsen/data-collector/blob/main/figs/DataPresenterDashboard.png?raw=true)
![DataVisualizer](https://github.com/Jesperpaulsen/data-collector/blob/main/figs/DataVisualizerMap.png?raw=true)

# Background for this project
During my previous semester at NTNU, I started to think about how much we use the Internet. That is when I began to dig into the climate consequences of the Internet and found a book written by Gerry McGovern - World Wide Waste. The book made me realize that the climate impact of the Internet is vast and that we need to do something about it before it's too late.

During the 26 years I've been alive, no one has told me that I emit CO$_2$ equivalents every single second that I'm using the Internet. During the five years I've been studying computer science, no one has told me about how the things I deploy to the Internet pollute; Everything we do on the Internet uses energy.

I feel like we today are seeing the Internet as we saw the ocean 60 years ago or so. We don't know what's happening when we upload all our images to the cloud; in the same way, we didn't realize what was happening when we threw our garbage in the ocean many years ago. But today, the consequences of all the trash that we have thrown into the sea are getting clearer and clearer. That's why I think it's important to focus on saving the Internet before it is too late.

Not many years ago, the cloud became what everyone was talking about. The cloud sounded great. We could upload everything we wanted without thinking about where we last had seen our hard disk. We didn't have to go to the store anymore to buy larger hard disks. We didn't need to worry about losing our hard disk anymore. Well, the cloud isn't a cloud. The cloud is just a lot of massive data centers stored worldwide, consuming enormous amounts of energy. Every time you access the cloud, you access a data center with your files stored on their hard disks. Your data then travels from the data center, in cables, through the world back to your computer. And the worst thing is; as long as you have data stored in the cloud, the data is constantly polluting. The cloud doesn't work like your hard disk, where it is turned off when you don't need your photos. Every image, file, and video you upload to the cloud will pollute until it is deleted. The cloud is always on. You are constantly using the world's resources.

Every time you visit a webpage, you pollute. Every time you send an email, you pollute. Every second you are watching a movie on Netflix, you are polluting. We can't stop using the Internet, and we shouldn't, but we should use it correctly so we are able to reach the climate goals. We need to stop digital littering. We need to raise awareness around the Internet and its carbon footprint. We need to find a sustainable way to use the Internet.

The goal of my master's thesis is to make people more aware of how they pollute when using the Internet. The ultimate goal will be to change the participants' behavior on the Internet.

# General info
This project uses a Chrome extension to estimate the CO2e emissions from web browsing. It calculates the emissions based on the destination country's carbon intensity. First the amount of data sent and recieved is converted using a factor of 0.09 kWh/GB. Then the emission factor of the destination country is fetched from the JSON object stored [here](https://github.com/Jesperpaulsen/data-collector/blob/8e3200b9995e1680a587b593fb2bd1d0eac6730b/packages/data-analyzer/src/data/co2PerKwhPerCountry.json) 

# Architecture
The overall architecture:
![Architecture](https://github.com/Jesperpaulsen/data-collector/blob/8fdf6ad907e268a6dd2f38da550a7555a9f1e223/figs/DataCollector%20flow%20-%20Architecture-1%20.jpg?raw=true)

The system consists of the following components:
* DataCollector: The Chrome extension's background page and content scripts
* DataPresenter: The Chrome extension's UI
* DataAnalyzer: The API
* DataVisualizer: Webpage to explore the usage

# Developing:
* [pnpm](https://pnpm.io/) is used as package manager. Install the packages with `pnpm i`
* A Firebase service account is required to run the data-analyzer package (You need to be added to the firestore project)
* Either navigate into a specific package or run all packages from the entry folder with `pnpm dev`
* To run the tests: Install [Firebase emulator suite](https://firebase.google.com/docs/emulator-suite) and start the emulators. Run the tests in the data-analyzer package with `pnpm test`
* To build the project run `pnpm build`
