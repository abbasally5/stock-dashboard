'use client';

export default function LoadingSpinner() {
    return (
        <div className="container has-text-centered mt-6">
            <div className="spinner"></div>
            <p className="subtitle is-5">
                Loading stock data...
            </p>
        </div>
    );
}