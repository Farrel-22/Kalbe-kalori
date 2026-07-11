// Base API Configuration
let currentCategory = 'it-shared-service';
let currentData = [];
let searchQuery = '';
let currentPage = 1;
const ITEMS_PER_PAGE = 50;
const API_URL_BASE = '/api/data?path=';

const IT_SHARED_SERVICE_NAMES = [
    "erwin rany",
    "priyono",
    "jerie mubayyin alhamdani",
    "kevin furqan",
    "nurul ilmi muhlisah aziz",
    "irfan sobarkah",
    "syarif hidayat",
    "novaldi valentino",
    "agus kurniawan",
    "hendra hendarsyah",
    "junet",
    "oke dwiky dharmawan",
    "wulandari wulan",
    "mila qoiriyah",
    "hery setiawan",
    "bangbang setiawan",
    "iman faturachman",
    "muga maulana",
    "angga setya budhi",
    "ade abdilah"
];

const TARGET_CALORIES = 60000000; // 60 Juta Kalori Target Anniversary

document.addEventListener('DOMContentLoaded', () => {
    // Initial fetch
    fetchData();

    // Set auto-refresh every 10 seconds for real-time updates
    setInterval(() => fetchData(true), 10000);

    // Event listener for dropdown category change
    document.getElementById('category-select').addEventListener('change', (e) => {
        currentCategory = e.target.value;
        currentPage = 1; // Reset to page 1
        updateUITitles();
        fetchData();
    });

    // Event listener for search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            currentPage = 1; // Reset to page 1
            renderLeaderboard();
        });
    }
});

function updateUITitles() {
    const titleMap = {
        'it-shared-service': 'Klasemen IT Shared Service',
        'all-participants': 'Klasemen Semua Peserta (Pria & Wanita)',
        'weekly-male': 'Klasemen Peserta Pria',
        'weekly-female': 'Klasemen Peserta Wanita'
    };
    const subtitleMap = {
        'it-shared-service': 'Peringkat internal kontribusi kalori tim IT Shared Service',
        'all-participants': 'Peringkat gabungan seluruh karyawan pria dan wanita Kalbe',
        'weekly-male': 'Peringkat kontribusi kalori individu karyawan pria',
        'weekly-female': 'Peringkat kontribusi kalori individu karyawan wanita'
    };
    
    const tableTitle = document.getElementById('table-title');
    if (tableTitle) tableTitle.textContent = titleMap[currentCategory] || 'Leaderboard';
    
    const tableSubtitle = document.getElementById('table-subtitle');
    if (tableSubtitle) tableSubtitle.textContent = subtitleMap[currentCategory] || '';
    
    const participantLabelEl = document.getElementById('participant-label');
    if (participantLabelEl) participantLabelEl.textContent = 'Karyawan';
}

async function fetchData(isSilent = false) {
    const loadingEl = document.getElementById('table-loading');
    if (!isSilent && loadingEl) {
        loadingEl.classList.remove('hidden');
    }

    try {
        let data = [];
        if (currentCategory === 'it-shared-service' || currentCategory === 'all-participants') {
            const [resM, resF] = await Promise.all([
                fetch(API_URL_BASE + 'leaderboard-weekly-male.php'),
                fetch(API_URL_BASE + 'leaderboard-weekly-female.php')
            ]);
            if (!resM.ok || !resF.ok) throw new Error('Network response was not ok');
            const jsonM = await resM.json();
            const jsonF = await resF.json();
            const dataM = jsonM.data || jsonM;
            const dataF = jsonF.data || jsonF;
            if (dataM.length > 0 && isNaN(parseInt(dataM[0][0]))) dataM.shift();
            if (dataF.length > 0 && isNaN(parseInt(dataF[0][0]))) dataF.shift();
            
            data = [...dataM, ...dataF];
        } else {
            let targetPath = '';
            if (currentCategory === 'weekly-male') targetPath = 'leaderboard-weekly-male.php';
            if (currentCategory === 'weekly-female') targetPath = 'leaderboard-weekly-female.php';
            
            if (targetPath) {
                const response = await fetch(API_URL_BASE + targetPath);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const json = await response.json();
                data = json.data || json; 
                if (data.length > 0 && isNaN(parseInt(data[0][0]))) data.shift();
            }
        }
        processData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        // Bisa tambahkan UI error handler jika diperlukan
    } finally {
        if (!isSilent && loadingEl) {
            loadingEl.classList.add('hidden');
        }
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(Math.round(num));
}

function titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

function processData(data) {
    // Data Normalization Overrides
    data.forEach(row => {
        if (String(row[1]).toLowerCase().includes("agus kurniawan")) {
            row[3] = "PT Sanghiang Perkasa";
        }
    });

    if (currentCategory === 'it-shared-service') {
        let itData = [];
        IT_SHARED_SERVICE_NAMES.forEach(itName => {
            const foundRow = data.find(row => String(row[1]).toLowerCase().includes(itName));
            if (foundRow) {
                itData.push([...foundRow]); // clone
            } else {
                itData.push(['-', titleCase(itName), '', 'PT Sanghiang Perkasa', 0]);
            }
        });
        // Sort and re-rank
        itData.sort((a, b) => parseFloat(b[4]) - parseFloat(a[4]));
        itData.forEach((row, idx) => { row[0] = idx + 1; });
        data = itData;
    } else if (data.length > 0) {
        // Jika mingguan, pastikan datanya di-sort berdasarkan kalori secara descending
        data.sort((a, b) => parseFloat(b[4]) - parseFloat(a[4]));
        // Re-assign ranks based on sorted order
        data.forEach((row, idx) => { row[0] = idx + 1; });
    }

    // Calculate Totals
    let totalCalories = 0;
    data.forEach(row => {
        totalCalories += parseFloat(row[4]) || 0;
    });

    const totalPackages = Math.floor(totalCalories / 500);
    const achievementPct = Math.min((totalCalories / TARGET_CALORIES) * 100, 100).toFixed(1);

    const totalCaloriesEl = document.getElementById('total-calories');
    if (totalCaloriesEl) totalCaloriesEl.textContent = formatNumber(totalCalories);

    const totalPackagesEl = document.getElementById('total-packages');
    if (totalPackagesEl) totalPackagesEl.textContent = formatNumber(totalPackages);
    
    const totalParticipantsEl = document.getElementById('total-participants');
    if (totalParticipantsEl) totalParticipantsEl.textContent = formatNumber(data.length);

    const milestoneTextEl = document.getElementById('milestone-text');
    if (milestoneTextEl) {
        milestoneTextEl.innerHTML = `${formatNumber(totalCalories)} <span class="text-gray-400 font-normal">/ ${formatNumber(TARGET_CALORIES)} kcal</span> (${achievementPct}%)`;
    }

    const milestoneBarEl = document.getElementById('milestone-bar');
    if (milestoneBarEl) {
        milestoneBarEl.style.width = `${achievementPct}%`;
    }

    // Populate Titles dynamically
    updateUITitles();

    // Store to currentData and render
    currentData = data;
    renderLeaderboard();
}

function getInitials(name) {
    let parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function renderLeaderboard() {
    const tbody = document.getElementById('leaderboard-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    // Search Filter
    let filteredData = currentData;
    if (searchQuery) {
        filteredData = currentData.filter(row => 
            String(row[1]).toLowerCase().includes(searchQuery) ||
            String(row[3]).toLowerCase().includes(searchQuery)
        );
    }
    
    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="py-8 text-center text-sm text-gray-500 font-medium">Tidak ada data.</td></tr>`;
        return;
    }

    filteredData.forEach(row => {
        tbody.innerHTML += createRowCard(row);
    });
}

function createRowCard(row) {
    const rank = parseInt(row[0]);
    const name = row[1];
    const bu = row[3];
    const cals = formatNumber(row[4]);
    
    const rankColor = rank === 1 ? 'text-amber-500 font-black text-base' : 
                      (rank === 2 ? 'text-slate-400 font-bold text-base' : 
                      (rank === 3 ? 'text-amber-700 font-bold text-base' : 'text-gray-400 font-semibold text-sm'));

    return `
        <tr class="hover:bg-emerald-50/30 transition-colors group">
            <td class="py-4 px-5 text-center">
                <span class="${rankColor}">${rank}</span>
            </td>
            <td class="py-4 px-4">
                <div class="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">${name}</div>
                ${bu ? `<div class="text-xs text-gray-500 mt-0.5">${bu}</div>` : ''}
            </td>
            <td class="py-4 px-5 text-right font-mono font-medium text-gray-900">
                ${cals}
            </td>
        </tr>
    `;
}

