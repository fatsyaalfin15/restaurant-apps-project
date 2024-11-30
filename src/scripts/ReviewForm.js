import { submitReview } from './main.js';


class ReviewForm extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
        <form id="reviewForm">
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" required>
          <label for="review">Review:</label>
          <textarea id="review" name="review" required></textarea>
          <button type="submit">Submit Review</button>
        </form>
      `;
    this.querySelector('#reviewForm').addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const name = this.querySelector('#name').value;
    const review = this.querySelector('#review').value;
    const restaurantId = this.getAttribute('data-restaurant-id');
    submitReview(restaurantId, { name, review });
  }
}

customElements.define('review-form', ReviewForm);
