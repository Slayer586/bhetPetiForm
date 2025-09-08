// ES Module imports (Firebase v10)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC35Bbuz2PWoGsHaya1ArhsTGTvWaeYsXY",
  authDomain: "bhetpeti-form.firebaseapp.com",
  projectId: "bhetpeti-form",
  storageBucket: "bhetpeti-form.firebasestorage.app",
  messagingSenderId: "1016907651758",
  appId: "1:1016907651758:web:1ffa285882e79dd5a56b3f"
};
// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const form = document.getElementById("bhetpetiForm");
const hasBhetPeti = document.getElementById("hasBhetPeti");
const bhetPetiNumberField = document.getElementById("bhetPetiNumberField");
const bhetPetiNumber = document.getElementById("bhetPetiNumber");
const village = document.getElementById("village");

const contactNumber = document.getElementById("contactNumber");
const pincode = document.getElementById("pincode");
const mainMemberDOB = document.getElementById("mainMemberDOB");
const mainMemberQualification = document.getElementById("mainMemberQualification");

const familyMembersDiv = document.getElementById("familyMembers");
const addMemberBtn = document.getElementById("addMemberBtn");

// Function to update family member numbers
function updateFamilyMemberNumbers() {
  const memberBlocks = [...document.querySelectorAll(".family-member")];
  memberBlocks.forEach((block, index) => {
    const header = block.querySelector("h3");
    header.textContent = `Family Member ${index + 1}`;
  });
}

// Utility: restrict to digits only
function digitsOnly(el) {
  el.addEventListener("input", () => {
    el.value = el.value.replace(/\D+/g, "");
  });
}
digitsOnly(bhetPetiNumber);
digitsOnly(contactNumber);
digitsOnly(pincode);

// Toggle Bhet Peti Number visibility + required
function updateBhetField() {
  if (hasBhetPeti.value === "Yes") {
    bhetPetiNumberField.style.display = "block";
    bhetPetiNumber.setAttribute("required", "required");
  } else {
    bhetPetiNumberField.style.display = "none";
    bhetPetiNumber.removeAttribute("required");
    bhetPetiNumber.value = "";
  }
}
hasBhetPeti.addEventListener("change", updateBhetField);
// Initialize state (default Yes)
updateBhetField();

// Add a new family member block
function addFamilyMember() {
  const wrapper = document.createElement("div");
  wrapper.className = "family-member";

  wrapper.innerHTML = `
    <h3>Family Member</h3>

    <label>Name <span class="required">*</span></label>
    <input type="text" placeholder="eg: Sagar Navin Mange" required />

    <label>Date of Birth <span class="required">*</span></label>
    <input type="date" required />

    <label>Qualification <span class="required">*</span></label>
    <input type="text" placeholder="eg: BTech Computer Engineering" required />

    <label>Relation with Main Member <span class="required">*</span></label>
    <select class="relation-select" required>
      <option value="">Select Relation</option>
      <option value="Son">Son</option>
      <option value="Daughter">Daughter</option>
      <option value="Wife">Wife</option>
      <option value="Husband">Husband</option>
      <option value="Father">Father</option>
      <option value="Mother">Mother</option>
      <option value="Brother">Brother</option>
      <option value="Sister">Sister</option>
      <option value="Daughter in Law">Daughter in Law</option>
      <option value="Son in Law">Son in Law</option>
      <option value="Sister in Law">Sister in Law</option>
      <option value="Brother in Law">Brother in Law</option>
      <option value="Grandfather">Grandfather</option>
      <option value="Grandmother">Grandmother</option>
      <option value="Grand son">Grand son</option>
      <option value="Grand Daughter">Grand Daughter</option>
      <option value="Uncle">Uncle</option>
      <option value="Aunt">Aunt</option>
      <option value="Nephew">Nephew</option>
      <option value="Niece">Niece</option>
      <option value="Cousin">Cousin</option>
      <option value="Other">Other</option>
    </select>
    <input type="text" class="custom-relation" placeholder="Please specify relation" />

    <button type="button" class="remove-btn">Remove</button>
  `;

  // Handle relation dropdown change
  const relationSelect = wrapper.querySelector(".relation-select");
  const customRelationInput = wrapper.querySelector(".custom-relation");
  
  relationSelect.addEventListener("change", function() {
    if (this.value === "Other") {
      customRelationInput.style.display = "block";
      customRelationInput.setAttribute("required", "required");
    } else {
      customRelationInput.style.display = "none";
      customRelationInput.removeAttribute("required");
      customRelationInput.value = "";
    }
  });

  // Remove handler
  wrapper.querySelector(".remove-btn").addEventListener("click", () => {
    wrapper.remove();
    updateFamilyMemberNumbers(); // Update numbers after removal
  });

  familyMembersDiv.appendChild(wrapper);
  updateFamilyMemberNumbers(); // Update numbers after addition
}

// Ensure button works
addMemberBtn.addEventListener("click", addFamilyMember);

// (Optional) start with one member block to guide users
addFamilyMember();

// Submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Add class to show validation errors
  form.classList.add("form-submitted");

  // At least one family member required
  const memberBlocks = [...document.querySelectorAll(".family-member")];
  if (memberBlocks.length === 0) {
    alert("Please add at least one family member.");
    return;
  }

  // Let browser validate HTML5 constraints first
  if (!form.checkValidity()) {
    // Find the first invalid field and focus it
    const firstInvalid = form.querySelector(":invalid");
    if (firstInvalid) {
      firstInvalid.focus();
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    form.reportValidity();
    return;
  }

  // Add loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Submitting...";
  form.classList.add("loading");

  const data = {
    hasBhetPeti: hasBhetPeti.value,
    bhetPetiNumber: bhetPetiNumber.value || null,
    village: village.value,
    contactNumber: contactNumber.value,
    email: document.getElementById("email").value,
    mainMemberName: document.getElementById("mainMemberName").value,
    mainMemberDOB: mainMemberDOB.value,
    mainMemberQualification: mainMemberQualification.value,
    address: {
      roomNo: document.getElementById("roomNo").value,
      street: document.getElementById("street").value,
      area: document.getElementById("area").value,
      city: document.getElementById("city").value,
      district: document.getElementById("district").value,
      state: document.getElementById("state").value,
      pincode: pincode.value
    },
    familyMembers: memberBlocks.map(block => {
      const inputs = block.querySelectorAll("input");
      const relationSelect = block.querySelector(".relation-select");
      const customRelationInput = block.querySelector(".custom-relation");
      
      let relation = relationSelect.value;
      if (relation === "Other" && customRelationInput.value.trim()) {
        relation = customRelationInput.value.trim();
      }
      
      return {
        name: inputs[0].value.trim(),
        dob: inputs[1].value,
        qualification: inputs[2].value.trim(),
        relation: relation
      };
    }),
    createdAt: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, "bhetpetiForms"), data);
    alert("✅ Form submitted successfully! Thank you for registering.");
    form.reset();
    form.classList.remove("form-submitted"); // Remove validation class
    familyMembersDiv.innerHTML = "";
    // Keep defaults after reset
    hasBhetPeti.value = "Yes";
    updateBhetField();
    addFamilyMember();
  } catch (err) {
    console.error("Error submitting form:", err);
    alert("❌ Failed to submit form. Please check your internet connection and try again.");
  } finally {
    // Remove loading state
    submitBtn.textContent = originalText;
    form.classList.remove("loading");
  }
});
