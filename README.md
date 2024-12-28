# 🗺️ Atlas Educação
[Atlas Educação](https://atlaseducacao.com/) is a tool designed to visualize access to high-quality public high schools across Brazil. Leveraging datasets from the Brazilian Demographic Census (2010) and the School Census (2020), the platform highlights disparities in <ins>educational access</ins> and correlates them with <ins>demographic factors</ins> such as <ins>income, race, and gender</ins>.

## 🖼️ Interface Preview

![alt text](public/BR-interface-preview.png)

## 📊 Core Metrics

### 1. Access Metric ($A_i$)
**Formula**: $A_i$ = $∑_{j∈[Dist(i,j)<16km]} R_j W_{ij} G_{ij}$

This metric combines <ins>demand and supply factors</ins> for high schools within a census tract, incorporating:

- **$R_j$: Demand-Adjusted Supply**: Calculated by dividing school capacity by the number of students aged 15-17 in the area;
- **$W_{ij}$: Distance Weighting**: Adjusts for proximity between students and schools;
- **$G_{ij}$: Competition Weighting**: Accounts for competition from neighboring schools within a 16 km radius.

It then <ins>sums up all access levels</ins> from <ins>each census tract</ins> to all other <ins>schools within 16 km</ins> to get the <ins>overall access</ins> for a census tract.

### 2. Quality-Access Metric ($H_i$). 

**Formula**: $H_i$ = $A_i Q_i$

An extension of the Access Metric, incorporating School Quality ($Q_i$), weighted using the IDEB (Primary Education Development Index) scores of each school.

## 🗺️ Visualization
The map <ins>visualizes these metrics</ins> by representing <ins>each dot as a cluster of approximately 10 school-age children</ins>, allowing users to observe:
- Areas with higher or lower access to high-quality public schools;
- Correlations between access levels and socioeconomic factors.

## 💻 User Interface
1. **Interactive Legend**: Adaptable by layer, showing distributions for different demographic groups (e.g., racial distribution).<br>
2. **Layer Options**: Access-Quality, Quality, Access, Income, Gender and Race. <br>
3. **Pop-up Information**: Detailed data for each location, including:
- Census tract ID;
- Number of school-age children;
- Average monthly income;
- Access and quality percentiles.

## 🎯 Purpose and Impact
Atlas Educação aims to inform the public and policymakers about geographic disparities in educational access. By identifying underserved regions, it guides resource allocation to improve educational equity. With over 20,500 school data points and demographic data across 310,000 census tracts, this tool is a robust resource for addressing educational inequality in Brazil, where the majority of high school students rely on public education.

## 📂 Resources
1. [Data (CSV + GeoJSON)](https://drive.google.com/drive/folders/1mLUgjvGivuuT-pvkGqEP_5QEk8fQOyJq?usp=sharing)<br>
2. [Methodology](https://drive.google.com/file/d/1XcylVaGVecnlIRGluxcbrwDkYOeJ9owh/view?usp=sharing)

## 🚀 Getting Started
### Prerequisites

🌐 **Web Browser**: Latest version of Chrome, Firefox, or Safari; <br>
🐍 **Python**: Version 3.8 or higher; <br>
📦 **Node.js**: Version 14 or higher. <br>

### Installation
1. Clone the Repository: ```git clone https://github.com/hordiienkoalina/atlas-educacao.git ```
2. Navigate to the Project Directory: ```cd atlas-educacao```
3. Install Dependencies: ```npm install```
4. Run the Application: ```npm start```

## 💡 Usage
- Open your web browser and navigate to http://localhost:3000.
- Use the interactive map to explore educational access across Brazil.
- Toggle different layers to view data on income, race, gender, and more.
- Click on dots to view detailed information about specific census tracts.

## 🤝 Contributing
Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch: ```git checkout -b feature/YourFeature.```
3. Commit your changes: ```git commit -m 'Add some feature'.```
4. Push to the branch: ```git push origin feature/YourFeature.```
5. Open a pull request.

## 📜 License

This project is licensed under the **GNU General Public License v3.0**. See the [LICENSE.md](https://github.com/hordiienkoalina/atlas-educacao/blob/main/LICENSE.md) file for details.

## 📧 Contact
LinkedIn: [Felipe Horta Oliveira](https://www.linkedin.com/in/felipehlvoliveira/) <br>
Email: felipehlvo@gmail.com <br>

LinkedIn: [Alina Hordiienko](https://www.linkedin.com/in/hordiienkoalina/) <br>
Email: alinahordiienko@gmail.com <br>
