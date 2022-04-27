<template>
  <div>
    <h3 class="text-3xl font-medium text-gray-700">Accounts</h3>

    <div class="mt-4">
      <h4>There are no Accounts setup yet. Create your first Account by filling out the form below</h4>
    </div>

    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <form @submit.prevent="postTransactionFile">
            <div>
              <label class="text-gray-700">Transaction File</label>
              <input
                  id="transaction-file"
                  type="file"
                  class="w-full mt-2 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
              />
            </div>
            <div class="flex justify-end mt-4">
              <button
                  class="px-4 py-2 text-gray-200 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
              >
                Upload File
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

async function postTransactionFile() {
  let file = document.getElementById("transaction-file").files[0];
  let formData = new FormData();
  formData.append("upload", file);
  try {
    const response = await axios.post('http://localhost:8080/upload-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
</script>
