// import java.util.*;

public class MaxSumSubarray {
    
    // Function to find the maximum sum of a subarray of size k
    public static int findMaxSumSubarray(int[] arr, int k) {
        // Edge case: If the array length is less than k
        if (arr.length < k) {
            System.out.println("Array size is smaller than subarray size.");
            return -1;
        }

        // Compute the sum of the first 'k' elements
        int maxSum = 0;
        for (int i = 0; i < k; i++) {
            maxSum += arr[i];
        }

        int windowSum = maxSum;

        // Slide the window over the array to find the maximum sum
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k]; // Add the next element and remove the element leaving the window
            maxSum = Math.max(maxSum, windowSum); // Update maxSum if we find a larger sum
        }

        return maxSum; // Return the maximum sum found
    }

//     public static void main(String[] args) {
//         // Example input array and subarray size
//         int[] arr = {2, 1, 5, 1, 3, 2};
//         int k = 3; // Subarray size

//         // Call the function and store the result
//         int result = findMaxSumSubarray(arr, k);

//         // Output the result
//         System.out.println("The maximum sum of a subarray of size " + k + " is: " + result);
//     }
// }
