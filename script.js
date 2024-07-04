// Download Button Events
document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const submitButton = document.getElementById("submitButton");

  submitButton.disabled = true;

  function toggleButtonState() {
    let atLeastOneChecked = false;
    checkboxes.forEach(function (checkbox) {
      if (checkbox.checked) {
        atLeastOneChecked = true;
      }
    });
    submitButton.disabled = !atLeastOneChecked;
    submitButton.style.cursor = submitButton.disabled
      ? "not-allowed"
      : "pointer";
  }

  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
    checkbox.addEventListener("change", toggleButtonState);
  });

  toggleButtonState();
});

// Script Generation Function
function generateScript() {
  // Check Prerequisites and Install Chocolatey
  let scriptContent = `# Check for supported version of Windows\n`;
  scriptContent += `if ([Environment]::OSVersion.Version -lt [Version]"6.1") {\n`;
  scriptContent += `    Write-Error "You must have Windows 7 or higher to use Chocolatey."\n`;
  scriptContent += `    exit\n`;
  scriptContent += `}\n\n`;

  scriptContent += `# Check for PowerShell v2 or higher\n`;
  scriptContent += `if ($PSVersionTable.PSVersion.Major -lt 2) {\n`;
  scriptContent += `    Write-Error "You must have PowerShell v2 or higher to use Chocolatey."\n`;
  scriptContent += `    exit\n`;
  scriptContent += `}\n\n`;

  // Install Chocolatey and Set Execution Policy
  scriptContent += `# Install Chocolatey\n`;
  scriptContent += `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))\n\n`;

  const checkedCheckboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );

  // Main script content
  scriptContent += `cls\n`;
  scriptContent += `# PowerShell script to install selected apps\n\n`;
  scriptContent += `Write-Output "Apps to be installed:"\n`;
  scriptContent += `Write-Output "-----------------------"\n`;
  checkedCheckboxes.forEach((checkbox, index) => {
    const appDisplayName = checkbox.parentElement.textContent.trim();
    scriptContent += `Write-Output "${index + 1}. ${appDisplayName}"\n`;
  });
  scriptContent += `\n$confirm = Read-Host "\nDo you want to install these apps? (Y/N)"\n`;
  scriptContent += `if ($confirm -eq "Y" -or $confirm -eq "y") {\n`;
  checkedCheckboxes.forEach((checkbox) => {
    const appName = checkbox.value;
    scriptContent += `\tWrite-Output "Installing ${appName}..."\n`;
    scriptContent += `\tchoco install ${appName} -y --limitoutput\n`;
  });
  scriptContent += `\n\tWrite-Output "All apps installed."\n`;
  scriptContent += `} else {\n`;
  scriptContent += `\tWrite-Output "Installation cancelled."\n`;
  scriptContent += `}\n`;

  const blob = new Blob([scriptContent], { type: "text/plain" });
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.click();

  // Create Toast
  const notify = document.getElementById("notify");
  setTimeout(function () {
    notify.style.left = "10px";
  }, 2000);

  // Toast Notification
  const guidenav = document.getElementById("guidenav");
  guidenav.addEventListener("click", (event) => {
    notify.style.left = "-320px";
  });
}
