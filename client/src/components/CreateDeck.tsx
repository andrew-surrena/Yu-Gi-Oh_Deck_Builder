import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_NEW_DECK } from "../utils/mutations";
import { QUERY_GETALLDECKS } from "../utils/queries";
import Auth from "../utils/auth";

const userId = Auth.getUserId();

const username = Auth.getUsername();

const CreateDeck = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        playable: false,
        type: "main",
        user: userId,
    });

    const [createDeck, { loading, error }] = useMutation(CREATE_NEW_DECK, {
        refetchQueries: [
            {
                query: QUERY_GETALLDECKS,
                variables: { username }, // Add the username variable here
            },
        ], // Refetch decks query with the username variable
        onCompleted: () => {
            setShowModal(false);
            // console.log("Deck created successfully!");
        },
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "playable" ? value === "true" : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createDeck({
                variables: { input: { ...formData } },
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="d-grid gap-2">
            {/* Create Deck Button */}
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Create New Deck
            </button>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Deck</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Name Field */}
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">
                                            Deck Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    {/* Playable Field */}
                                    <div className="mb-3">
                                        <label className="form-label">Is the deck playable?</label>
                                        <div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="playable"
                                                    id="playableYes"
                                                    value="true"
                                                    onChange={handleInputChange}
                                                    checked={formData.playable === true}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="playableYes"
                                                >
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="playable"
                                                    id="playableNo"
                                                    value="false"
                                                    onChange={handleInputChange}
                                                    checked={formData.playable === false}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="playableNo"
                                                >
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Type Field */}
                                    <div className="mb-3">
                                        <label htmlFor="type" className="form-label">
                                            Deck Type
                                        </label>
                                        <select
                                            className="form-select"
                                            id="type"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="main">Main</option>
                                            <option value="side">Side</option>
                                            <option value="extra">Extra</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating..." : "Create Deck"}
                                    </button>
                                </form>
                                {error && (
                                    <p className="text-danger mt-3">Error: {error.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateDeck;
