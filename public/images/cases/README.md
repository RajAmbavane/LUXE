# Case Images Directory

This directory contains before/after images for all 16 luxury marketplace dispute cases.

## Structure

Each case has its own directory with two images:
- `original.jpg` - The original item as listed/sold
- `returned.jpg` - The item as returned by the buyer

## Cases

- **LX-2101** - Rolex Submariner Date ($12,500) - Return Fraud
- **LX-2102** - Cartier Tank Solo ($3,200) - Item Not As Described  
- **LX-2103** - Hermès Birkin 35 ($18,900) - Counterfeit
- **LX-2104** - Louis Vuitton Neverfull MM ($1,850) - Return Fraud
- **LX-2105** - Patek Philippe Calatrava ($28,500) - Shipping Damage
- **LX-2106** - Chanel Classic Flap Bag ($7,200) - Return Fraud
- **LX-2107** - Audemars Piguet Royal Oak Offshore ($35,000) - Return Fraud
- **LX-2109** - Prada Saffiano Tote ($2,100) - Item Not As Described
- **LX-2110** - Bulgari Serpenti Watch ($4,800) - Defective Item
- **LX-2111** - Tiffany Setting Engagement Ring ($8,900) - Return Fraud
- **LX-2112** - Cartier Love Bracelet ($7,400) - Return Fraud
- **LX-2113** - Omega Speedmaster Professional ($5,200) - Return Fraud
- **LX-2116** - Gucci Dionysus Bag ($3,100) - Counterfeit
- **LX-2117** - Bottega Veneta Intrecciato Bag ($4,200) - Return Fraud
- **LX-2118** - Omega Seamaster Aqua Terra ($6,800) - Return Fraud
- **LX-2120** - Van Cleef & Arpels Alhambra Necklace ($9,500) - Return Fraud

## Image Requirements

- **Format**: JPG or PNG
- **Size**: Recommended 800x800px minimum
- **Quality**: High resolution for AI analysis
- **Naming**: Exactly `original.jpg` and `returned.jpg`

## Usage

The visual agent will automatically load these images using the URLs:
- Original: `/images/cases/{case_id}/original.jpg`
- Returned: `/images/cases/{case_id}/returned.jpg`